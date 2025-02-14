import { InfraDi } from "./infra/infra.di";
import { RepositoryDi as RepoDi } from "../database/repo/repo.di";
import { ScryDi } from "./scryfall/scry.di";
import { MtgDi } from "./mtg/mtg.di";
import { CollectionDi } from "./collection/collection.di";

export class ServicesDI {
  public static register() {
    InfraDi.registerInfrastructure();
    CollectionDi.registerCollection();
    MtgDi.registerMTG();
    RepoDi.registerRepositories();
    ScryDi.registerScryfall();
  }
}
