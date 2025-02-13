/* eslint-disable no-console */
import { singleton } from "tsyringe";
import { LogSource } from "../../base";
import { ILogService } from "../interfaces/log.service";

@singleton()
export class LogService implements ILogService {
  //#region ILogService methods -----------------------------------------------
  public info(source: LogSource, message: string, ...args: Array<unknown>): void {
    console.log(`[${source}] `.concat(message), ...args);
  }

  public error(source: LogSource, message: string, ...args: Array<unknown>): void {
    console.error(`[${source}] `.concat(message), ...args);
  }

  public warning(source: LogSource, message: string, ...args: Array<unknown>): void {
    console.warn(`[${source}] `.concat(message), ...args);
  }

  public debug(source: LogSource, message: string, ...args: Array<unknown>): void {
    console.debug(`[${source}] `.concat(message), ...args);
  }
  //#endregion
}
