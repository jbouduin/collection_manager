import { container, Lifecycle } from "tsyringe";
import { IRouter } from "../base";
import { INFRASTRUCTURE } from "../service.tokens";
import { CardConditionRouter, CollectionRouter } from "./routers";


export class CollectionDi {
  public static registerCollection() {
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: CardConditionRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: CollectionRouter }, { lifecycle: Lifecycle.Singleton });
  }
}
