import { ToastProps } from "@blueprintjs/core";
import { EIpcStatus, IpcChannel, IpcRequest, IpcResponse } from "../../../common/ipc";

export interface IIpcProxyService {
  logServerResponses: boolean;
  deleteData(path: string): Promise<number>;
  getData<T extends object | string>(path: string): Promise<T>;
  postData<T extends object, U extends object>(path: string, data: T): Promise<U>;
  putData<T extends object, U extends object>(path: string, data: T): Promise<U>;
  patchData<T extends object, U extends object>(path: string, data: T): Promise<U>;
}

export class IpcProxyService implements IIpcProxyService {
  //#region Private fields ----------------------------------------------------
  private showToast: (props: ToastProps, key?: string) => void;
  private deleteRequestCounter = 0;
  private getRequestCounter = 0;
  private patchRequestCounter = 0;
  private postRequestCounter = 0;
  private putRequestCounter = 0;
  //#endregion

  //#region Public fields -----------------------------------------------------
  public logServerResponses: boolean;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(showToast: (props: ToastProps, key?: string) => void) {
    this.showToast = showToast;
    this.logServerResponses = false;
  }
  //#endregion

  //#region IPC-proxy methods -------------------------------------------------
  public deleteData(path: string): Promise<number> {
    const request: IpcRequest<never> = {
      id: ++this.deleteRequestCounter,
      path: path
    };

    return window.ipc.data("DELETE", request)
      .then(
        (response: IpcResponse<number>) => {
          if (response.status >= EIpcStatus.BadRequest) {
            return this.processIpcErrorResponse("DELETE", response);
          } else {
            return this.processIpcResponse(response);
          }
        },
        (reason: Error) => this.processIpcRejection("DELETE", reason)
      );
  }

  public getData<T extends object | string>(path: string): Promise<T> {
    const request: IpcRequest<never> = {
      id: ++this.getRequestCounter,
      path: path
    };
    return window.ipc.data("GET", request)
      .then(
        (response: IpcResponse<T>) => {
          if (response.status >= EIpcStatus.BadRequest) {
            return this.processIpcErrorResponse("GET", response);
          } else {
            return this.processIpcResponse(response);
          }
        },
        (reason: Error) => this.processIpcRejection("GET", reason)
      );
  }

  public postData<T extends object, U extends object>(path: string, data: T): Promise<U> {
    const request: IpcRequest<T> = {
      id: ++this.postRequestCounter,
      path: path,
      data: data
    };
    return window.ipc.data("POST", request)
      .then(
        (response: IpcResponse<U>) => {
          if (response.status >= EIpcStatus.BadRequest) {
            return this.processIpcErrorResponse("POST", response);
          } else {
            return this.processIpcResponse(response);
          }
        },
        (reason: Error) => this.processIpcRejection<U>("POST", reason)
      );
  }

  public putData<T extends object, U extends object>(path: string, data: T): Promise<U> {
    const request: IpcRequest<T> = {
      id: ++this.putRequestCounter,
      path: path,
      data: data
    };
    return window.ipc.data("PUT", request)
      .then(
        (response: IpcResponse<U>) => {
          if (response.status >= EIpcStatus.BadRequest) {
            return this.processIpcErrorResponse("PUT", response);
          } else {
            return this.processIpcResponse(response);
          }
        },
        (reason: Error) => this.processIpcRejection("PUT", reason)
      );
  }

  public patchData<T extends object, U extends object>(path: string, data: T): Promise<U> {
    const request: IpcRequest<T> = {
      id: ++this.patchRequestCounter,
      path: path,
      data: data
    };
    return window.ipc.data("PATCH", request)
      .then(
        (response: IpcResponse<U>) => {
          if (response.status >= EIpcStatus.BadRequest) {
            return this.processIpcErrorResponse("PATCH", response);
          } else {
            return this.processIpcResponse(response);
          }
        },
        (reason: Error) => this.processIpcRejection("PATCH", reason)
      );
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  private processIpcErrorResponse<T>(channel: IpcChannel, response: IpcResponse<T>): Promise<never> {
    let errorMessage: string = undefined;
    switch (response.status) {
      case EIpcStatus.BadRequest:
        errorMessage = "Bad formatted request.";
        break;
      case EIpcStatus.Conflict:
        errorMessage = "The data has been changed by another user.";
        break;
      case EIpcStatus.Error:
        errorMessage = "Server error.";
        break;
      case EIpcStatus.Forbidden:
        errorMessage = "This action is forbidden.";
        break;
      case EIpcStatus.Gone:
        errorMessage = "The resource has gone";
        break;
      case EIpcStatus.NotAllowed:
        errorMessage = "This action is not allowed.";
        break;
      case EIpcStatus.NotFound:
        errorMessage = "Resource not found.";
        break;
      case EIpcStatus.NotImplemented:
        errorMessage = "Not implemented";
        break;
      case EIpcStatus.Unauthorized:
        errorMessage = "You are not allowed to perform this action.";
        break;
      case EIpcStatus.Unprocessable:
        errorMessage = "You are not allowed to perform this action.";
        break;
    }

    if (errorMessage) {
      void this.showToast(
        {
          message: `${response.status}: ${response.message ?? errorMessage}`,
          intent: "danger",
          isCloseButtonShown: true,
          icon: "warning-sign"
        },
        `${channel}-${this.getRequestCounter}`
      );
    }
    return Promise.reject(new Error(`Server error: ${response.status}`));
  }

  private processIpcResponse<T>(response: IpcResponse<T>): T {
    if (this.logServerResponses) {
      // eslint-disable-next-line no-console
      console.log(response);
    }
    return response.data;
  }

  private processIpcRejection<T>(channel: IpcChannel, reason: Error): Promise<T> {
    void this.showToast(
      {
        message: reason.message ?? "Some error occurred",
        intent: "danger",
        isCloseButtonShown: true,
        icon: "warning-sign"
      },
      `${channel}-${this.getRequestCounter}`
    );
    return Promise.reject<T>(reason);
  }
  //#endregion
}
