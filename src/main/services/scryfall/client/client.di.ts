import { Lifecycle, container } from "tsyringe";

import CLIENTTOKENS, { IScryfallClient } from "./interfaces";
import { ScryfallClient } from "./implementation/scryfall-client";


export class ClientDi {
  public static registerClient() {
    container.register<IScryfallClient>(CLIENTTOKENS.ScryfallClient, { useClass: ScryfallClient }, { lifecycle: Lifecycle.Singleton });
  }
}
