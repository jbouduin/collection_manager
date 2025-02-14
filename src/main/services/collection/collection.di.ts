import { container, Lifecycle } from "tsyringe";
import { IRouter } from "../base";
import { INFRASTRUCTURE } from "../service.tokens";
import { CollectionRouter } from "./routers";


export class CollectionDi {
  public static registerCollection() {
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: CollectionRouter }, { lifecycle: Lifecycle.Singleton });
  }
}
