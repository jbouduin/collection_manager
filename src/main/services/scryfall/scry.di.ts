import { Lifecycle, container } from "tsyringe";
import { ApiClient } from "./implementation/api-client";
import SCRYTOKENS, { IApiClient } from "./interfaces";

export class ScryDi {
  public static registerScryfall() {
    container.register<IApiClient>(SCRYTOKENS.ApiClient, { useClass: ApiClient }, { lifecycle: Lifecycle.Singleton });
  }
}
