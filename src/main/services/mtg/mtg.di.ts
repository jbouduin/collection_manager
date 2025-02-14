import { container, Lifecycle } from "tsyringe";
import { IRouter } from "../base";
import { INFRASTRUCTURE } from "../service.tokens";
import { CardSetRouter, CardSymbolRouter } from "./routers";
import { LanguageRouter } from "./routers";
import { CardRouter } from "./routers";
import { OracleRouter } from "./routers";

export class MtgDi {
  public static registerMTG() {
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: CardRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: CardSetRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: CardSymbolRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: LanguageRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: OracleRouter }, { lifecycle: Lifecycle.Singleton });
  }
}
