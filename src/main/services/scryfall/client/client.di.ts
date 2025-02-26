import { Lifecycle, container } from "tsyringe";
import { SCRYFALL } from "../../service.tokens";
import { ScryfallClient } from "./implementation/scryfall-client";
import { IScryfallClient } from "./interfaces";


export class ClientDi {
  public static registerClient() {
    container.register<IScryfallClient>(SCRYFALL.ScryfallClient, { useClass: ScryfallClient }, { lifecycle: Lifecycle.Singleton });
  }
}
