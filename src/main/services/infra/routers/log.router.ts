import { inject, singleton } from "tsyringe";
import { LogEntryDto } from "../../../../common/dto/infra/log-entry.dto";
import { EIpcStatus, IpcRequest } from "../../../../common/ipc";
import { BaseRouter, IResult, IRouter, Result, RouteCallback } from "../../base";
import { INFRASTRUCTURE } from "../../service.tokens";
import { IResultFactory, IRouterService } from "../interfaces";
import { ILogService } from "../interfaces/log.service";


@singleton()
export class LogRouter extends BaseRouter implements IRouter {
  //#region Constructor -------------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(logService, resultFactory);
  }
  //#endregion

  //#region IRouteDestinationService methods ----------------------------------
  public setRoutes(router: IRouterService): void {
    router.registerPostRoute("/log/info", this.info.bind(this) as RouteCallback);
    router.registerPostRoute("/log/error", this.error.bind(this) as RouteCallback);
    router.registerPostRoute("/log/warning", this.warning.bind(this) as RouteCallback);
    router.registerPostRoute("/log/debug", this.debug.bind(this) as RouteCallback);
  }
  //#endregion

  //#region private methods ---------------------------------------------------
  public info(logEntry: IpcRequest<LogEntryDto>): Promise<IResult<void>> {
    this.logService.info("Renderer", logEntry.data.message, logEntry.data.args);
    return Promise.resolve(new Result<void>(EIpcStatus.NoContent));
  }

  public error(logEntry: IpcRequest<LogEntryDto>): Promise<IResult<void>> {
    this.logService.error("Renderer", logEntry.data.message, logEntry.data.args);
    return Promise.resolve(new Result<void>(EIpcStatus.NoContent));
  }

  public warning(logEntry: IpcRequest<LogEntryDto>): Promise<IResult<void>> {
    this.logService.warning("Renderer", logEntry.data.message, logEntry.data.args);
    return Promise.resolve(new Result<void>(EIpcStatus.NoContent));
  }

  public debug(logEntry: IpcRequest<LogEntryDto>): Promise<IResult<void>> {
    this.logService.debug("Renderer", logEntry.data.message, logEntry.data.args);
    return Promise.resolve(new Result<void>(EIpcStatus.NoContent));
  }
  //#endregion
}
