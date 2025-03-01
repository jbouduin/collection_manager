import { container, Lifecycle } from "tsyringe";
import { IRouter } from "../base";
import { INFRASTRUCTURE, MTG } from "../service.tokens";
import { MtgSyncService } from "./implementation/mtg-sync.service";
import { IMtgSyncService } from "./interfaces";
import { CardRouter, CardSetRouter, CardSymbolRouter, CatalogRouter, OracleRouter } from "./routers";
import { MtgSyncRouter } from "./routers/mtg-sync.router";

export class MtgDi {
  public static register() {
    container.register<IMtgSyncService>(MTG.SyncService, { useClass: MtgSyncService }, { lifecycle: Lifecycle.Singleton });

    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: CardRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: CardSetRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: CardSymbolRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: CatalogRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: OracleRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: MtgSyncRouter }, { lifecycle: Lifecycle.Singleton });
  }
}
