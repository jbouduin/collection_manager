import { WebContents } from "electron";
import { isObject } from "lodash";
import { Match, match } from "path-to-regexp";
import { inject, singleton } from "tsyringe";
import { IpcChannel, IpcRequest } from "../../../../common/ipc";
import { BaseRouter, IResult, RouteCallback, RoutedRequest } from "../../base";
import { INFRASTRUCTURE } from "../../service.tokens";
import { ILogService, IResultFactory, IRouterService } from "../interfaces";

@singleton()
export class RouterService extends BaseRouter implements IRouterService {
  //#region Private properties: routes ----------------------------------------
  private readonly deleteRoutes: Map<string, RouteCallback>;
  private readonly getRoutes: Map<string, RouteCallback>;
  private readonly patchRoutes: Map<string, RouteCallback>;
  private readonly postRoutes: Map<string, RouteCallback>;
  private readonly putRoutes: Map<string, RouteCallback>;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(logService, resultFactory);
    this.deleteRoutes = new Map<string, RouteCallback>();
    this.getRoutes = new Map<string, RouteCallback>();
    this.patchRoutes = new Map<string, RouteCallback>();
    this.postRoutes = new Map<string, RouteCallback>();
    this.putRoutes = new Map<string, RouteCallback>();
  }
  //#endregion

  //#region IRouterService methods --------------------------------------------
  public logRoutes(): void {
    this.logService.info("Main", `registered ${this.deleteRoutes.size} DELETE routes`);
    this.deleteRoutes.forEach((_value: RouteCallback, key: string) => this.logService.debug("Main", `-  DELETE ${key}`));
    this.logService.info("Main", `registered ${this.getRoutes.size} GET routes`);
    this.getRoutes.forEach((_value: RouteCallback, key: string) => this.logService.debug("Main", `-  GET ${key}`));
    this.logService.info("Main", `registered ${this.patchRoutes.size} PATCH routes`);
    this.patchRoutes.forEach((_value: RouteCallback, key: string) => this.logService.debug("Main", `-  PATCH ${key}`));
    this.logService.info("Main", `registered ${this.postRoutes.size} POST routes`);
    this.postRoutes.forEach((_value: RouteCallback, key: string) => this.logService.debug("Main", `-  POST ${key}`));
    this.logService.info("Main", `registered ${this.putRoutes.size} PUT routes`);
    this.putRoutes.forEach((_value: RouteCallback, key: string) => this.logService.debug("Main", `-  PUT ${key}`));
  }

  public registerDeleteRoute(path: string, callback: RouteCallback): void {
    this.deleteRoutes.set(path, callback);
  }

  public registerGetRoute(path: string, callback: RouteCallback): void {
    this.getRoutes.set(path, callback);
  }

  public registerPatchRoute(path: string, callback: RouteCallback): void {
    this.patchRoutes.set(path, callback);
  }

  public registerPostRoute(path: string, callback: RouteCallback): void {
    this.postRoutes.set(path, callback);
  }

  public registerPutRoute(path: string, callback: RouteCallback): void {
    this.putRoutes.set(path, callback);
  }

  public routeRequest(requestType: IpcChannel, sender: WebContents, request: IpcRequest<unknown>): Promise<IResult<unknown>> {
    let result: Promise<IResult<unknown>>;
    let routeDictionary: Map<string, RouteCallback>;
    switch (requestType) {
      case "DELETE": {
        routeDictionary = this.deleteRoutes;
        break;
      }
      case "GET": {
        routeDictionary = this.getRoutes;
        break;
      }
      case "PATCH": {
        routeDictionary = this.patchRoutes;
        break;
      }
      case "POST": {
        routeDictionary = this.postRoutes;
        break;
      }
      case "PUT": {
        routeDictionary = this.putRoutes;
        break;
      }
    }
    if (!routeDictionary) {
      result = this.resultFactory.createBadRequestResultPromise();
    } else {
      try {
        result = this.route(requestType, sender, request, routeDictionary);
      } catch (err) {
        result = this.resultFactory.createExceptionResultPromise(err);
      }
    }
    return result;
  }
  //#endregion

  //#region private helper methods --------------------------------------------
  private route(
    requestType: IpcChannel,
    sender: WebContents,
    request: IpcRequest<unknown>,
    routeDictionary: Map<string, RouteCallback>
  ): Promise<IResult<unknown>> {
    this.logService.debug("Main", `start routing: ${requestType} ${request.path}`);
    let result: Promise<IResult<unknown>>;

    try {
      const splittedPath = request.path.split("?");
      const routes = Array.from(routeDictionary.keys());
      const matchedKey = routes.find((key: string) => {
        const matcher = match(key);
        const matchResult = matcher(splittedPath[0]);
        return matchResult !== false;
      });

      if (matchedKey) {
        const matcher2 = match(matchedKey);
        const matchResult2: Match<Partial<Record<string, string | Array<string>>>> = matcher2(splittedPath[0]);

        if (isObject(matchResult2)) {
          this.logService.debug("Main", `Route found: ${requestType} ${matchedKey}`);
          const routedRequest = new RoutedRequest();
          routedRequest.route = matchedKey;
          routedRequest.sender = sender;
          routedRequest.path = matchResult2.path;
          routedRequest.params = matchResult2.params as Record<string, string>;
          routedRequest.data = request.data;
          routedRequest.queryParams = {};
          if (splittedPath.length > 1) {
            const queryParts = splittedPath[1].split("&");
            queryParts.forEach((part: string) => {
              const kvp = part.split("=");
              if (kvp.length > 1) {
                routedRequest.queryParams[kvp[0]] = kvp[1];
              }
            });
          }
          const route = routeDictionary.get(matchedKey);
          if (route) {
            result = route(routedRequest)
              .catch((err: unknown) => {
                this.logService.error("Main", `Error executing ${requestType} ${request.path}`, err);
                return this.resultFactory.createExceptionResult(err);
              });
          }
        } else {
          this.logService.error("Main", "strange error!");
          result = this.resultFactory.createErrorResultPromise("Error in router");
        }
      } else {
        this.logService.error("Main", `route ${requestType} ${request.path} not found`);
        result = this.resultFactory.createNotFoundResultPromise(request.path);
      }
    } catch (err) {
      this.logService.error("Main", `Error routing ${requestType} ${request.path}`, err);
      result = this.resultFactory.createExceptionResultPromise(err);
    }
    return result;
  }
  //#endregion
}
