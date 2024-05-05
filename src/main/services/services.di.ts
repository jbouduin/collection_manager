import { AdaptDi } from "./adapt/adapt.di";
import { InfraDi } from "./infra/infra.di";
import { RepositoryDi as RepoDi } from "./repo/repo.di";
import { SyncDi } from "./sync/sync.di";


export class ServicesDI {

  public static register() {
    InfraDi.registerInfrastructure();
    RepoDi.registerRepositories();
    SyncDi.registerSynchronizers();
    AdaptDi.registerAdapters();
  }
}
