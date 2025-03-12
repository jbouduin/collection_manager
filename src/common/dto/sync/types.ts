import { ISyncParamDto } from "./sync-param.dto";

export type ICardSyncParam = Omit<
  ISyncParamDto,
  "catalogTypesToSync" | "syncCardSymbols" | "syncCardSets" | "rulingSyncType" | "oracleId"
>;
export type IRulingSyncParam = Omit<
  ISyncParamDto,
  "catalogTypesToSync" | "syncCardSymbols" | "syncCardSets" | "cardSyncType" | "cardImageStatusToSync" | "syncCardsSyncedBeforeNumber" | "syncCardsSyncedBeforeUnit" | "cardSetCodeToSyncCardsFor" | "changedImageStatusAction"
>;
