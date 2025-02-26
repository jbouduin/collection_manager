import { container, Lifecycle } from "tsyringe";
import { IRouter } from "../base";
import { INFRASTRUCTURE, MTG } from "../service.tokens";
import { CardSetRouter, CardSymbolRouter } from "./routers";
import { LanguageRouter } from "./routers";
import { CardRouter } from "./routers";
import { OracleRouter } from "./routers";
import { IMtgSyncService } from "./interfaces";
import { MtgSyncService } from "./implementation/mtg-sync.service";
import { MtgSyncRouter } from "./routers/mtg-sync.router";

export class MtgDi {
  public static register() {
    container.register<IMtgSyncService>(MTG.SyncService, { useClass: MtgSyncService }, { lifecycle: Lifecycle.Singleton });

    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: CardRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: CardSetRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: CardSymbolRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: LanguageRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: OracleRouter }, { lifecycle: Lifecycle.Singleton });
    container.register<IRouter>(INFRASTRUCTURE.Router, { useClass: MtgSyncRouter }, { lifecycle: Lifecycle.Singleton });
  }
}
