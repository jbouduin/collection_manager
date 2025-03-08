import { DependencyContainer, Lifecycle } from "tsyringe";
import { IBaseMigration } from "../base-migration";
import { DATABASE } from "../../../services/service.tokens";
import { V1_0_0_CardCondition_Migration, V1_0_0_Catalog_Migration, V1_0_0_Color_Migration, V1_0_0_GameFormat_Migration, V1_0_0_Language_Migration } from "./00.master-data";
import { V1_0_0_Card_Migration, V1_0_0_CardSymbol_Migration, V1_0_0_Oracle_Migration, V1_0_0_Set_Migration } from "./01.mtg";
import { V1_0_0_Collection_Migration, V1_0_0_OwnedCard_Migration } from "./02.collection";
import { V1_0_0_Deck_Migration } from "./03.deck/0030.v1.0.0.deck";

export class V1_0_0_Di {
  public static registerMigrations(container: DependencyContainer): DependencyContainer {
    //#region master data -----------------------------------------------------
    container.register<IBaseMigration>(DATABASE.Migration, { useClass: V1_0_0_Catalog_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(DATABASE.Migration, { useClass: V1_0_0_Color_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(DATABASE.Migration, { useClass: V1_0_0_Language_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(DATABASE.Migration, { useClass: V1_0_0_GameFormat_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(DATABASE.Migration, { useClass: V1_0_0_CardCondition_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    //#endregion

    //#region Mtg --------------------------------------------------------------
    container.register<IBaseMigration>(DATABASE.Migration, { useClass: V1_0_0_Set_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(DATABASE.Migration, { useClass: V1_0_0_CardSymbol_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(DATABASE.Migration, { useClass: V1_0_0_Card_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(DATABASE.Migration, { useClass: V1_0_0_Oracle_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    //#endregion

    //#region Collection ------------------------------------------------------
    container.register<IBaseMigration>(DATABASE.Migration, { useClass: V1_0_0_Collection_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    container.register<IBaseMigration>(DATABASE.Migration, { useClass: V1_0_0_OwnedCard_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    //#endregion

    //#region Deck ------------------------------------------------------------
    container.register<IBaseMigration>(DATABASE.Migration, { useClass: V1_0_0_Deck_Migration }, { lifecycle: Lifecycle.ResolutionScoped });
    //#endregion

    return container;
  }
}
