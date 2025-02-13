import { ToastProps } from "@blueprintjs/core";
import { EIpcStatus, IpcRequest, IpcResponse } from "../../../common/ipc";


export class IpcProxyService {
  //#region Private fields ----------------------------------------------------
  private showToast: (props: ToastProps, key?: string) => void;
  private deleteRequestCounter = 0;
  private getRequestCounter = 0;
  private patchRequestCounter = 0;
  private postRequestCounter = 0;
  private putRequestCounter = 0;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(showToast: (props: ToastProps, key?: string) => void) {
    this.showToast = showToast;
  }
  //#endregion

  //#region IPC-proxy methods -------------------------------------------------
  public deleteData(path: string): Promise<never> {
    const request: IpcRequest<never> = {
      id: ++this.deleteRequestCounter,
      path: path
    };

    return window.ipc.data("DELETE", request)
      .then((response: IpcResponse<never>) => this.processIpcResponse(response))
      .catch((reason: Error) => this.processIpcRejection(reason));
  }

  public getData<T extends object>(path: string): Promise<T> {
    const request: IpcRequest<never> = {
      id: ++this.getRequestCounter,
      path: path
    };
    return window.ipc.data("GET", request)
      .then((response: IpcResponse<T>) => this.processIpcResponse(response))
      .catch((reason: Error) => this.processIpcRejection(reason));
  }

  public postData<T extends object, U extends object>(path: string, data: T): Promise<U> {
    const request: IpcRequest<T> = {
      id: ++this.postRequestCounter,
      path: path,
      data: data
    };
    return window.ipc.data("POST", request)
      .then((response: IpcResponse<U>) => this.processIpcResponse(response))
      .catch((reason: Error) => this.processIpcRejection<U>(reason));
  }

  public putData<T extends object, U extends object>(path: string, data: T): Promise<U> {
    const request: IpcRequest<T> = {
      id: ++this.putRequestCounter,
      path: path,
      data: data
    };
    return window.ipc.data("PUT", request)
      .then((response: IpcResponse<U>) => this.processIpcResponse(response))
      .catch((reason: Error) => this.processIpcRejection(reason));
  }

  public patchData<T extends object, U extends object>(path: string, data: T): Promise<U> {
    const request: IpcRequest<T> = {
      id: ++this.patchRequestCounter,
      path: path,
      data: data
    };
    return window.ipc.data("PATCH", request)
      .then((response: IpcResponse<U>) => this.processIpcResponse(response))
      .catch((reason: Error) => this.processIpcRejection(reason));
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  private processIpcResponse<T>(response: IpcResponse<T>): T {
    // eslint-disable-next-line no-console
    console.log(response);
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
        `POST-${this.getRequestCounter}`
      );
    }
    return response.data;
  }

  private processIpcRejection<T>(reason: Error): Promise<T> {
    void this.showToast(
      {
        message: reason.message ?? "Some error occurred",
        intent: "danger",
        isCloseButtonShown: true,
        icon: "warning-sign"
      },
      `POST-${this.getRequestCounter}`
    );
    return Promise.resolve<T>(undefined);
  }
  //#endregion
}
