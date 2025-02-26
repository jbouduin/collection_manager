import { ILogService, IResultFactory } from "../../infra/interfaces";
import { IResult } from "../types/result";

abstract class Base {
  //#region protected fields --------------------------------------------------
  protected readonly logService: ILogService;
  protected readonly resultFactory: IResultFactory;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(logService: ILogService, resultFactory: IResultFactory) {
    this.logService = logService;
    this.resultFactory = resultFactory;
  }
  //#endregion
}

export abstract class BaseService extends Base {
  //#region Constructor & C° --------------------------------------------------
  public constructor(logService: ILogService, resultFactory: IResultFactory) {
    super(logService, resultFactory);
  }
  //#endregion
}

export abstract class BaseRouter extends Base {
  //#region Constructor & C° --------------------------------------------------
  public constructor(logService: ILogService, resultFactory: IResultFactory) {
    super(logService, resultFactory);
  }
  //#endregion

  //#region protected methods -------------------------------------------------
  protected parseIntegerUrlParameter(id: string, parameterName: string): IResult<number> {
    const number = Number.parseInt(id);
    return isNaN(number)
      ? this.resultFactory.createBadRequestResult(`Invalid ${parameterName} '${id}'`)
      : this.resultFactory.createSuccessResult(number);
  }
  //#endregion
}
