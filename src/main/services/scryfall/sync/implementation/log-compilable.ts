import { Compilable } from "kysely";
import { ILogService } from "../../../infra/interfaces";

export function logCompilable<T extends Compilable>(logService: ILogService, compilable: T): T {
  const compiled = compilable.compile();
  logService.debug("Main", compiled.sql, compiled.parameters);
  return compilable;
}
