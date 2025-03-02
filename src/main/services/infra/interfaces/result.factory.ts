import { IResult } from "../../base";

export interface IResultFactory {
  createExceptionResult<T>(error: unknown): IResult<T>;
  createExceptionResultPromise<T>(error: unknown): Promise<IResult<T>>;
  createBadRequestResult<T>(message?: string): IResult<T>;
  createBadRequestResultPromise<T>(message?: string): Promise<IResult<T>>;
  createConflictResult<T>(message?: string): IResult<T>;
  createConflictResultPromise<T>(message?: string): Promise<IResult<T>>;
  createErrorResult<T>(message?: string): IResult<T>;
  createErrorResultPromise<T>(message?: string): Promise<IResult<T>>;
  createNoContentResult<T>(): IResult<T>;
  createNoContentResultPromise<T>(): Promise<IResult<T>>;
  createNotFoundResult<T>(resource: string): IResult<T>;
  createNotFoundResultPromise<T>(resource: string): Promise<IResult<T>>;
  createNotImplementedResult<T>(): IResult<T>;
  createNotImplementedResultPromise<T>(): Promise<IResult<T>>;
  createSuccessResult<T>(data: T): IResult<T>;
  createSuccessResultPromise<T>(data: T): Promise<IResult<T>>;
}
