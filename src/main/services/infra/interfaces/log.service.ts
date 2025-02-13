import { LogSource } from "../../base";

export interface ILogService {
  info(source: LogSource, message: string, ...args: Array<unknown>): void;
  error(source: LogSource, message: string, ...args: Array<unknown>): void;
  warning(source: LogSource, message: string, ...args: Array<unknown>): void;
  debug(source: LogSource, message: string, ...args: Array<unknown>): void;
}
