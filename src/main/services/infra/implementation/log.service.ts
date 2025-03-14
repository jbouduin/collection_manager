/* eslint-disable no-console */
import { singleton } from "tsyringe";
import { LogSource } from "../../base";
import { ILogService } from "../interfaces/log.service";


// TODO have a loglevel for every logsource
@singleton()
export class LogService implements ILogService {
  //#region ILogService methods -----------------------------------------------
  public info(source: LogSource, message: string, ...args: Array<unknown>): void {
    console.log(`[${source}] `.concat(message), ...args);
  }

  public error(source: LogSource, message: string, ...args: Array<unknown>): void {
    console.error(`\x1b[35m [${source}] `.concat(message).concat(" \x1b[0m"), ...args);
  }

  public warning(source: LogSource, message: string, ...args: Array<unknown>): void {
    console.warn(`\x1b[33m [${source}] `.concat(message).concat(" \x1b[0m"), ...args);
  }

  public debug(source: LogSource, message: string, ...args: Array<unknown>): void {
    console.debug(`[${source}] `.concat(message), ...args);
  }
  //#endregion
}
