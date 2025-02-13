import { EIpcStatus } from "../../../../common/ipc";


export interface IResult<T> {
  status: EIpcStatus;
  data?: T;
  message?: string;

  /**
   * Convert the result to a result with a different datatype
   *
   * @param onSuccess function to be executed if the current status is not an error
   * @param onFailure function to be executed if the current status is an error
   */
  continue<U>(onSuccess: (r: IResult<T>) => IResult<U>, onFailure: (r: Result<T>) => IResult<U>): IResult<U>;
  /**
   * Convert the result to a result promise with a different datatype
   *
   * @param onSuccess function to be executed if the current status is not an error
   * @param onFailure function to be executed if the current status is an error
   */
  continueAsync<U>(
    onSuccess: (r: IResult<T>) => Promise<IResult<U>>,
    onFailure: (r: Result<T>) => Promise<IResult<U>>
  ): Promise<IResult<U>>;
  /**
   * Convert the data of the result, preserving the message and status.
   *
   * @param onSuccess function to be executed if the current status is not an error. If this parameter is not provided, data is undefined.
   * @param onFailure function to be executed if the current status is an error. If this parameter is not provided, data is undefined.
   */
  convert<U>(onSuccess?: (r: T) => U, onFailure?: (r: T) => U): IResult<U>;
  /**
   * Convert the data of the result asynchronously, preserving the message and status.
   *
   * @param onSuccess function to be executed if the current status is not an error. If this parameter is not provided, data is undefined.
   * @param onFailure function to be executed if the current status is an error. If this parameter is not provided, data is undefined.
   */
  convertAsync<U>(onSuccess?: (r: T) => U, onFailure?: (r: T) => U): Promise<IResult<U>>;
  /**
   * Process the result's data
   *
   * @param onSuccess function to be executed if the current status is not an error.
   * @param onFailure function to be executed if the current status is an error.
   * @returns this
   */
  processData(onSuccess?: (r: T) => void, onFailure?: (r: T) => void): IResult<T>;
  /**
   * Process the result
   *
   * @param onSuccess function to be executed if the current status is not an error.
   * @param onFailure function to be executed if the current status is an error.
   * @returns this
   */
  processResult(onSuccess?: (r: IResult<T>) => void, onFailure?: (r: IResult<T>) => T): IResult<T>;
}

export class Result<T> implements IResult<T> {
  //#region IResult fields ----------------------------------------------------
  public readonly status: EIpcStatus;
  public data?: T;
  public message?: string;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(status: EIpcStatus, data?: T, message?: string) {
    this.status = status;
    this.data = data;
    this.message = message;
  }
  //#endregion

  //#region IResult methods ---------------------------------------------------
  public continue<U>(onSuccess: (r: IResult<T>) => IResult<U>, onFailure: (r: Result<T>) => IResult<U>): IResult<U> {
    if (this.status < EIpcStatus.BadRequest) {
      return onSuccess(this);
    } else {
      return onFailure(this);
    }
  }

  public continueAsync<U>(
    onSuccess: (r: IResult<T>) => Promise<IResult<U>>,
    onFailure: (r: Result<T>) => Promise<IResult<U>>
  ): Promise<IResult<U>> {
    if (this.status < EIpcStatus.BadRequest) {
      return onSuccess(this);
    } else {
      return onFailure(this);
    }
  }
  public convert<U>(onSuccess?: (r: T) => U, onFailure?: (r: T) => U): IResult<U> {
    const result: Result<U> = new Result<U>(this.status, undefined, this.message);
    if (this.status < EIpcStatus.BadRequest) {
      result.data = onSuccess ? onSuccess(this.data) : undefined;
    } else {
      result.data = onFailure ? onFailure(this.data) : undefined;
    }
    return result;
  }

  public convertAsync<U>(onSuccess?: (r: T) => U, onFailure?: (r: T) => U): Promise<IResult<U>> {
    return Promise.resolve(this.convert(onSuccess, onFailure));
  }

  public processData(onSuccess?: (r: T) => void, onFailure?: (r: T) => void): IResult<T> {
    if (this.status < EIpcStatus.BadRequest) {
      if (onSuccess) {
        onSuccess(this.data);
      }
    } else {
      if (onFailure) {
        onFailure(this.data);
      }
    }
    return this;
  }

  public processResult(onSuccess?: (r: IResult<T>) => void, onFailure?: (r: IResult<T>) => void): IResult<T> {
    if (this.status < EIpcStatus.BadRequest) {
      if (onSuccess) {
        onSuccess(this);
      }
    } else {
      if (onFailure) {
        onFailure(this);
      }
    }
    return this;
  }
  //#endregion
}
