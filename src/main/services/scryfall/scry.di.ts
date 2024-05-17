import { SyncDi } from "./sync/sync.di";
import { AdaptDi } from "./adapt/adapt.di";
import { ClientDi } from "./client/client.di";

export class ScryDi {
  public static registerScryfall() {
    ClientDi.registerClient();
    SyncDi.registerSynchronizers();
    AdaptDi.registerAdapters();
  }
}
