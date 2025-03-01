import { container, Lifecycle } from "tsyringe";
import { IRouter } from "../base";
import { INFRASTRUCTURE } from "../service.tokens";
import { ColorRouter, LanguageRouter } from "./routers";

export class MasterDataDi {
  public static register() {
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: ColorRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: LanguageRouter }, { lifecycle: Lifecycle.Singleton });
  }
}
