import { container, Lifecycle } from "tsyringe";
import { IRouter } from "../base";
import { INFRASTRUCTURE } from "../service.tokens";
import { DeckRouter } from "./routers/deck.router";


export class DeckDi {
  public static register() {
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: DeckRouter }, { lifecycle: Lifecycle.Singleton });
  }
}
