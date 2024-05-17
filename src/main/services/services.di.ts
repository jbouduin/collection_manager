import { AdaptDi } from "./scryfall/adapt/adapt.di";
import { InfraDi } from "./infra/infra.di";
import { RepositoryDi as RepoDi } from "./repo/repo.di";
import { ScryDi } from "./scryfall/scry.di";

export class ServicesDI {
  public static register() {
    InfraDi.registerInfrastructure();
    RepoDi.registerRepositories();
    AdaptDi.registerAdapters();
    ScryDi.registerScryfall();
  }
}
