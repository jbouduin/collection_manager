import { WebContents } from "electron";
import { IpcChannel, IpcRequest } from "../../../../common/ipc";
import { DeleteRouteCallback, IResult, RouteCallback } from "../../base";


export interface IRouterService {
  logRoutes(): void;
  registerDeleteRoute(path: string, callback: DeleteRouteCallback): void;
  registerGetRoute(path: string, callback: RouteCallback): void;
  registerPatchRoute(path: string, callback: RouteCallback): void;
  registerPostRoute(path: string, callback: RouteCallback): void;
  registerPutRoute(path: string, callback: RouteCallback): void;
  routeRequest(requestType: IpcChannel, sender: WebContents, request: IpcRequest<unknown>): Promise<IResult<unknown>>;
}
