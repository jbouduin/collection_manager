import { InfraDi } from "./infra/infra.di";
import { RepositoryDi as RepoDi } from "../database/repo/repo.di";
import { ScryDi } from "./scryfall/scry.di";
import { MtgDi } from "./mtg/mtg.di";
import { CollectionDi } from "./collection/collection.di";
import { MasterDataDi } from "./master-data/master-data.di";
import { DeckDi } from "./deck/deck.di";

export class ServicesDI {
  public static register() {
    InfraDi.register();
    CollectionDi.register();
    DeckDi.register();
    MasterDataDi.register();
    MtgDi.register();
    RepoDi.registerRepositories();
    ScryDi.registerScryfall();
  }
}
