import { inject, injectable } from "tsyringe";
import { EIpcStatus } from "../../../../common/ipc";
import { IResult, Result } from "../../base";
import { INFRASTRUCTURE } from "../../service.tokens";
import { ILogService, IResultFactory } from "../interfaces";

@injectable()
export class ResultFactory implements IResultFactory {
  //#region Private fields ----------------------------------------------------
  private readonly logService: ILogService;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(@inject(INFRASTRUCTURE.LogService) logService: ILogService) {
    this.logService = logService;
  }
  //#endregion

  //#region IResultFactory methods --------------------------------------------
  public createExceptionResult<T>(error: unknown): IResult<T> {
    let message: string;

    if (error instanceof Error) {
      message = `Exception: ${error.name}: ${error.message}`;
      this.logService.error("Main", message, error);
    } else {
      message = "Some error occured";
      this.logService.error("Main", message, error);
    }
    return this.createErrorResult(message);
  }

  public createExceptionResultPromise<T>(error: unknown): Promise<IResult<T>> {
    return Promise.resolve(this.createExceptionResult(error));
  }

  public createBadRequestResult<T>(message?: string): IResult<T> {
    return new Result<T>(EIpcStatus.BadRequest, undefined, message);
  }

  public createBadRequestResultPromise<T>(message?: string): Promise<IResult<T>> {
    return Promise.resolve(this.createBadRequestResult(message));
  }

  public createConflictResult<T>(message?: string): IResult<T> {
    return new Result<T>(EIpcStatus.Conflict, undefined, message);
  }

  public createConflictResultPromise<T>(message?: string): Promise<IResult<T>> {
    return Promise.resolve(this.createConflictResult(message));
  }

  public createErrorResult<T>(message?: string): IResult<T> {
    return new Result<T>(EIpcStatus.Error, undefined, message);
  }

  public createErrorResultPromise<T>(message?: string): Promise<IResult<T>> {
    return Promise.resolve(this.createErrorResult(message));
  }

  public createNoContentResult<T>(): IResult<T> {
    return new Result<T>(EIpcStatus.NoContent);
  }

  public createNoContentResultPromise<T>(): Promise<IResult<T>> {
    return Promise.resolve(this.createNoContentResult());
  }

  public createNotFoundResult<T>(resource: string): IResult<T> {
    return new Result<T>(EIpcStatus.NotFound, undefined, `Resource '${resource}' not found.`);
  }

  public createNotFoundResultPromise<T>(resource: string): Promise<IResult<T>> {
    return Promise.resolve(this.createNotFoundResult(resource));
  }

  public createNotImplementedResult<T>(): IResult<T> {
    return new Result<T>(EIpcStatus.NotImplemented, undefined);
  }

  public createNotImplementedResultPromise<T>(): Promise<IResult<T>> {
    return Promise.resolve(this.createNotImplementedResult());
  }

  public createSuccessResult<T>(data: T): IResult<T> {
    return new Result<T>(EIpcStatus.Ok, data);
  }

  public createSuccessResultPromise<T>(data: T): Promise<IResult<T>> {
    return Promise.resolve(this.createSuccessResult(data));
  }
  //#endregion
}
