import { DeleteResult, InsertResult, Transaction, UpdateResult, sql } from "kysely";
import { inject, injectable } from "tsyringe";
import { CardSyncParam, DtoCardImageData, IdSelectResult } from "../../../../../common/dto";
import { ProgressCallback } from "../../../../../common/ipc";
import { ChangedImageStatusAction, GameFormat, ImageStatus, MTGColor, MTGColorType, TimespanUnit } from "../../../../../common/types";
import { isSingleCardFaceLayout, sqliteUTCTimeStamp } from "../../../../../common/util";
import { DatabaseSchema } from "../../../../../main/database/schema";
import { IConfigurationService, IDatabaseService, IImageCacheService, ILogService } from "../../../../../main/services/infra/interfaces";
import { runSerial } from "../../../../../main/services/infra/util";
import { INFRASTRUCTURE, SCRYFALL } from "../../../service.tokens";
import {
  ICardAdapter, ICardCardMapAdapter, ICardColorMapAdapter, ICardGameAdapter, ICardMultiverseIdAdapter,
  ICardfaceAdapter, ICardfaceColorMapAdapter,
  IOracleAdapter, IOracleKeywordAdapter, IOracleLegalityAdapter
} from "../../adapt/interface";
import { CardColorMapAdapterParameter, CardFaceAdapterParameter, OracleAdapterParameter } from "../../adapt/interface/param";
import { CardfaceColorMapAdapterParameter } from "../../adapt/interface/param/cardface-color-map-adapter.param";
import { OracleLegalityAdapterParameter } from "../../adapt/interface/param/oracle-legality-adapter.param";
import { IScryfallClient } from "../../client/interfaces";
import { ScryfallCard, ScryfallCardface, ScryfallLegalities } from "../../types";
import { ICardSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";
import { GenericSyncTaskParameter } from "./generic-sync-task.parameter";
import { logCompilable } from "./log-compilable";

type IdAndStatusSelectResult = IdSelectResult & { image_status: ImageStatus };
type PreSyncSelectResult = {
  scryfallCards: Array<ScryfallCard>;
  cardIdsWithStatus: Array<IdAndStatusSelectResult>;
};

@injectable()
export class CardSyncService extends BaseSyncService<CardSyncParam> implements ICardSyncService {
  //#region Private readonly fields -------------------------------------------
  private readonly imageCacheService: IImageCacheService;
  private readonly cardAdapter: ICardAdapter;
  private readonly cardColorMapAdapter: ICardColorMapAdapter;
  private readonly cardCardMapAdapter: ICardCardMapAdapter;
  private readonly cardGameAdapter: ICardGameAdapter;
  private readonly cardMultiverseIdAdapter: ICardMultiverseIdAdapter;
  private readonly cardfaceAdapter: ICardfaceAdapter;
  private readonly cardfaceColorMapAdapter: ICardfaceColorMapAdapter;
  private readonly oracleAdapter: IOracleAdapter;
  private readonly oracleKeywordAdapter: IOracleKeywordAdapter;
  private readonly oracleLegalityAdapter: IOracleLegalityAdapter;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.ConfigurationService) configurationService: IConfigurationService,
    @inject(INFRASTRUCTURE.ImageCacheService) imageCacheService: IImageCacheService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(SCRYFALL.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(SCRYFALL.CardAdapter) cardAdapter: ICardAdapter,
    @inject(SCRYFALL.CardColorMapAdapter) cardColorMapAdapter: ICardColorMapAdapter,
    @inject(SCRYFALL.CardCardMapAdapter) cardCardMapAdapter: ICardCardMapAdapter,
    @inject(SCRYFALL.CardGameAdapter) cardGameAdapter: ICardGameAdapter,
    @inject(SCRYFALL.CardMultiverseIdAdapter) cardMultiverseIdAdapter: ICardMultiverseIdAdapter,
    @inject(SCRYFALL.CardfaceAdapter) cardfaceAdapter: ICardfaceAdapter,
    @inject(SCRYFALL.CardfaceColorMapAdapter) cardfaceColorMapAdapter: ICardfaceColorMapAdapter,
    @inject(SCRYFALL.OracleAdapter) oracleAdapter: IOracleAdapter,
    @inject(SCRYFALL.OracleKeywordAdapter) oracleKeywordAdapter: IOracleKeywordAdapter,
    @inject(SCRYFALL.OracleLegalityAdapter) oracleLegalityAdapter: IOracleLegalityAdapter
  ) {
    super(databaseService, configurationService, logService, scryfallclient);
    this.imageCacheService = imageCacheService;
    this.cardAdapter = cardAdapter;
    this.cardColorMapAdapter = cardColorMapAdapter;
    this.cardCardMapAdapter = cardCardMapAdapter;
    this.cardGameAdapter = cardGameAdapter;
    this.cardMultiverseIdAdapter = cardMultiverseIdAdapter;
    this.cardfaceAdapter = cardfaceAdapter;
    this.cardfaceColorMapAdapter = cardfaceColorMapAdapter;
    this.oracleAdapter = oracleAdapter;
    this.oracleKeywordAdapter = oracleKeywordAdapter;
    this.oracleLegalityAdapter = oracleLegalityAdapter;
  }
  //#endregion

  //#region ICardSyncService methods ------------------------------------------
  public override async sync(syncParam: CardSyncParam, progressCallback: ProgressCallback): Promise<void> {
    return this.GetSyncData(syncParam, progressCallback)
      .then(async (presync: PreSyncSelectResult) => {
        this.dumpScryFallData("cards.json", presync.scryfallCards);
        return this.processSync(presync.scryfallCards, progressCallback)
          .then(async () => this.processChangedImages(syncParam.changedImageStatusAction, presync.cardIdsWithStatus, progressCallback));
      })
      .then(() => {
        if (syncParam.cardSyncType == "byCardSet") {
          this.database
            .updateTable("card_set")
            .set({ last_full_synchronization_at: sqliteUTCTimeStamp })
            .where("card_set.code", "=", syncParam.cardSetCodeToSyncCardsFor)
            .executeTakeFirst();
        }
      });
  }
  //#endregion

  //#region Presync auxiliary methods -----------------------------------------
  private async GetSyncData(syncParam: CardSyncParam, progressCallback: ProgressCallback): Promise<PreSyncSelectResult> {
    let presyncResult: Promise<PreSyncSelectResult>;
    if (syncParam.cardSyncType == "byCardSet") {
      presyncResult = this.database.selectFrom("card")
        .select(["card.id", "card.image_status"])
        .innerJoin("card_set", "card_set.id", "card.set_id")
        .where("card_set.code", "=", syncParam.cardSetCodeToSyncCardsFor)
        .execute()
        .then(async (results: Array<IdAndStatusSelectResult>) => {
          const scryfallCards = await this.scryfallclient.getCardsForCardSet(
            syncParam.cardSetCodeToSyncCardsFor,
            progressCallback
          );
          return {
            scryfallCards: scryfallCards,
            cardIdsWithStatus: results
          };
        });
    } else {
      presyncResult = this.database
        .selectFrom("card")
        .select(["card.id", "card.image_status"])
        .$if(
          syncParam.cardSyncType == "byLastSynchronized",
          (eb) => eb.where("card.last_synced_at", "<", sql.lit(this.convertLastSyncParameters(syncParam.syncCardsSyncedBeforeNumber, syncParam.syncCardsSyncedBeforeUnit)))
        )
        .$if(
          syncParam.cardSyncType == "byImageStatus",
          (eb) => eb.where("card.image_status", "in", syncParam.cardImageStatusToSync)
        )
        .$if(
          syncParam.cardSyncType == "collection",
          (eb) => eb.where("card.id", "in", syncParam.cardSelectionToSync)
        )
        .$call((q) => logCompilable(this.logService, q))
        .execute()
        .then(async (results: Array<IdAndStatusSelectResult>) => {
          if (results.length > 0 || syncParam.cardSelectionToSync.length > 0) {
            const idsTouse = syncParam.cardSyncType == "collection"
              ? syncParam.cardSelectionToSync
              : results.map((result: IdSelectResult) => result.id);
            const scryfallCards = await this.scryfallclient.getCardCollections(idsTouse, progressCallback);
            return {
              scryfallCards: scryfallCards,
              cardIdsWithStatus: results
            };
          } else {
            return {
              scryfallCards: new Array<ScryfallCard>(),
              cardIdsWithStatus: results
            };
          }
        });
    }
    return presyncResult;
  }
  //#endregion

  //#region Auxiliary sync methods --------------------------------------------
  private async processSync(cards: Array<ScryfallCard>, progressCallback?: ProgressCallback): Promise<void> {
    const total = cards.length;
    let cnt = 0;
    return Promise
      .all(cards.map((card: ScryfallCard) => this.syncSingleCard(card, ++cnt, total, progressCallback)))
      .then(() => Promise.resolve());
  }

  private async syncSingleCard(card: ScryfallCard, cnt: number, total: number, progressCallback?: ProgressCallback): Promise<void> {
    return this.database
      .transaction()
      .execute(async (trx: Transaction<DatabaseSchema>) => {
        this.logService.debug("Main", `${card.name} ${card.lang} = start sync ======================================`);
        if (progressCallback) {
          progressCallback(`Processing ${card.name} (${cnt}/${total})`);
        }
        this.logService.debug("Main", `${card.name} ${card.lang} - single sync of card`);
        const insertOrUpdate: Promise<InsertResult | UpdateResult> = this.genericSingleSync(
          trx,
          "card",
          (eb) => eb("card.id", "=", card.id),
          this.cardAdapter,
          card
        );

        return await insertOrUpdate
          .then(async () => await this.syncCardColorMap(trx, card))
          .then(async () => await this.syncCardCardMap(trx, card))
          .then(async () => await this.syncOracle(trx, card))
          .then(async () => await this.syncOracleKeywords(trx, card))
          .then(async () => await this.syncOracleLegalities(trx, card))
          .then(async () => await this.syncCardGames(trx, card))
          .then(async () => await this.syncMultiverseIds(trx, card))
          .then(async () => await this.syncCardFaces(trx, card));
      })
      .then(
        () => this.logService.debug("Main", `${card.name} ${card.lang} = card synced =====================================`),
        (reason: Error) => {
          this.logService.debug("Main", `${card.name} ${card.lang} = failed !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
          this.logService.debug("Main", reason.message);
        }
      );
  }

  private async syncCardColorMap(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<void> {
    const taskParameters = new Array<GenericSyncTaskParameter<"card_color_map", CardColorMapAdapterParameter>>();
    if (scryfallCard.colors?.length > 0) {
      taskParameters.push(this.createCardColorMapTaskParameter(trx, scryfallCard.id, "card", scryfallCard.colors));
    }

    if (scryfallCard.color_identity?.length > 0) {
      taskParameters.push(this.createCardColorMapTaskParameter(trx, scryfallCard.id, "identity", scryfallCard.color_identity));
    }

    if (scryfallCard.color_indicator?.length > 0) {
      taskParameters.push(this.createCardColorMapTaskParameter(trx, scryfallCard.id, "indicator", scryfallCard.color_identity));
    }

    if (scryfallCard.produced_mana?.length > 0) {
      taskParameters.push(this.createCardColorMapTaskParameter(trx, scryfallCard.id, "produced_mana", scryfallCard.produced_mana));
    }
    return await runSerial<GenericSyncTaskParameter<"card_color_map", CardColorMapAdapterParameter>>(
      taskParameters,
      async (param: GenericSyncTaskParameter<"card_color_map", CardColorMapAdapterParameter>, index: number, total: number) => this.serialGenericDeleteAndRecreate(param, index, total)
    );
  }

  private async syncOracle(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<InsertResult | UpdateResult | void> {
    if (isSingleCardFaceLayout(scryfallCard.layout)) {
      this.logService.debug("Main", `${scryfallCard.name} ${scryfallCard.lang} - single sync of oracle`);
      return await this.genericSingleSync(
        trx,
        "oracle",
        (eb) => eb("oracle.oracle_id", "=", scryfallCard.oracle_id).and("oracle.face_sequence", "=", 0),
        this.oracleAdapter,
        { oracleId: scryfallCard.oracle_id, sequence: 0, scryfallCard: scryfallCard }
      );
    } else {
      this.logService.debug("Main", `${scryfallCard.name} ${scryfallCard.lang} - single sync of oracle for split card`);
      const uniqueOracleIds = scryfallCard.layout != "reversible_card"
        ? scryfallCard.card_faces
        : [...new Map(scryfallCard.card_faces.map((cardface: ScryfallCardface) => [cardface.oracle_id, cardface])).values()];
      const taskParameters: Array<GenericSyncTaskParameter<"oracle", OracleAdapterParameter>> =
        uniqueOracleIds.map((cardFace: ScryfallCardface, idx: number) => {
          const oracle_id = scryfallCard.layout == "reversible_card" ? cardFace.oracle_id : scryfallCard.oracle_id;
          return {
            trx: trx,
            tableName: "oracle",
            adapter: this.oracleAdapter,
            filter: (eb) => eb("oracle.oracle_id", "=", oracle_id).and("oracle.face_sequence", "=", idx),
            scryfall: { oracleId: oracle_id, sequence: idx, scryfallCardFace: cardFace }
          };
        });

      return await runSerial<GenericSyncTaskParameter<"oracle", OracleAdapterParameter>>(
        taskParameters,
        async (param: GenericSyncTaskParameter<"oracle", OracleAdapterParameter>, index: number, total: number) => super.serialGenericSingleSync(param, index, total)
      );
    }
  }

  private async syncOracleKeywords(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<Array<DeleteResult> | InsertResult> {
    if (scryfallCard.keywords?.length > 0 && scryfallCard.oracle_id) { // TODO cover reversible_card here also
      this.logService.debug("Main", `${scryfallCard.name} ${scryfallCard.lang} - delete and recreate oracle_keyword`);
      return await this.genericDeleteAndRecreate(
        trx,
        "oracle_keyword",
        (eb) => eb("oracle_keyword.oracle_id", "=", scryfallCard.oracle_id),
        this.oracleKeywordAdapter,
        { oracle_id: scryfallCard.oracle_id, keywords: scryfallCard.keywords }
      );
    } else {
      this.logService.debug("Main", `${scryfallCard.name} ${scryfallCard.lang} - delete oracle_keyword`);
      return await trx
        .deleteFrom("oracle_keyword")
        .where("oracle_keyword.oracle_id", "=", scryfallCard.oracle_id)
        .execute();
    }
  }

  private async syncOracleLegalities(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<void | Array<DeleteResult>> {
    if (scryfallCard.legalities) {
      const taskParameters = new Array<GenericSyncTaskParameter<"oracle_legality", OracleLegalityAdapterParameter>>();
      Object.keys(scryfallCard.legalities).forEach((key: string) => {
        if (scryfallCard.layout != "reversible_card") {
          taskParameters.push({
            trx: trx,
            tableName: "oracle_legality",
            filter: (eb) => eb("oracle_legality.oracle_id", "=", scryfallCard.oracle_id).and("oracle_legality.format", "=", key as GameFormat),
            adapter: this.oracleLegalityAdapter,
            scryfall: {
              oracle_id: scryfallCard.oracle_id,
              gameFormat: key as GameFormat,
              legality: scryfallCard.legalities[key as keyof ScryfallLegalities]
            }
          });
        } else {
          const uniqueOracleIds = scryfallCard.layout != "reversible_card"
            ? [...new Map(scryfallCard.card_faces.map((cardface: ScryfallCardface) => [cardface.oracle_id, cardface])).values()]
            : scryfallCard.card_faces;
          uniqueOracleIds.forEach((cardface: ScryfallCardface) => taskParameters.push({
            trx: trx,
            tableName: "oracle_legality",
            filter: (eb) => eb("oracle_legality.oracle_id", "=", cardface.oracle_id).and("oracle_legality.format", "=", key as GameFormat),
            adapter: this.oracleLegalityAdapter,
            scryfall: {
              oracle_id: cardface.oracle_id,
              gameFormat: key as GameFormat,
              legality: scryfallCard.legalities[key as keyof ScryfallLegalities]
            }
          }));
        }
      });

      return await runSerial<GenericSyncTaskParameter<"oracle_legality", OracleLegalityAdapterParameter>>(
        taskParameters,
        async (param: GenericSyncTaskParameter<"oracle_legality", OracleLegalityAdapterParameter>, index: number, total: number) => super.serialGenericSingleSync(param, index, total)
      );
    } else {
      return await this.database
        .deleteFrom("oracle_legality")
        .where("oracle_legality.oracle_id", "=", scryfallCard.oracle_id)
        .execute();
    }
  }

  private async syncCardGames(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<Array<DeleteResult> | InsertResult> {
    if (scryfallCard.games?.length > 0) {
      this.logService.debug("Main", `${scryfallCard.name} ${scryfallCard.lang} - delete and recreate card_game`);
      return await this
        .genericDeleteAndRecreate(
          trx,
          "card_game",
          (eb) => eb("card_game.card_id", "=", scryfallCard.id),
          this.cardGameAdapter,
          { card_id: scryfallCard.id, games: scryfallCard.games }
        );
    } else {
      this.logService.debug("Main", `${scryfallCard.name} ${scryfallCard.lang} - delete oracle_keyword`);
      return await trx
        .deleteFrom("card_game")
        .where("card_game.card_id", "=", scryfallCard.id)
        .execute();
    }
  }

  private async syncMultiverseIds(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<Array<DeleteResult> | InsertResult> {
    if (scryfallCard.multiverse_ids?.length > 0) {
      return await this
        .genericDeleteAndRecreate(
          trx,
          "card_multiverse_id",
          (eb) => eb("card_multiverse_id.card_id", "=", scryfallCard.id),
          this.cardMultiverseIdAdapter,
          { card_id: scryfallCard.id, multiverseIds: scryfallCard.multiverse_ids }
        );
    } else {
      return await trx
        .deleteFrom("card_multiverse_id")
        .where("card_multiverse_id.card_id", "=", scryfallCard.id)
        .execute();
    }
  }

  private async syncCardFaces(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<void> {
    // if layout is normal: scrfall does not return cardfaces, so we save the whole card a single cardface
    let cardfaceAdapterParameter: CardFaceAdapterParameter;

    if (isSingleCardFaceLayout(scryfallCard.layout)) {
      cardfaceAdapterParameter = {
        scryfallCard: scryfallCard
      };
    } else {
      cardfaceAdapterParameter = {
        scryfallCard: scryfallCard,
        scryfallCardfaces: scryfallCard.card_faces
      };
    }
    await this
      .genericDeleteAndRecreate(
        trx,
        "cardface",
        (eb) => eb("cardface.card_id", "=", scryfallCard.id),
        this.cardfaceAdapter,
        cardfaceAdapterParameter
      )
      .then(async () => {
        if (!isSingleCardFaceLayout(scryfallCard.layout)) {
          const taskParameters = new Array<GenericSyncTaskParameter<"cardface_color_map", CardfaceColorMapAdapterParameter>>();
          scryfallCard.card_faces.forEach((cardFace: ScryfallCardface, idx: number) => {
            if (cardFace.colors?.length > 0) {
              taskParameters.push(this.createCardFaceColorMapTaskParameter(trx, scryfallCard.id, idx, "card", cardFace.colors));
            }

            if (cardFace.color_indicator?.length > 0) {
              taskParameters.push(this.createCardFaceColorMapTaskParameter(trx, scryfallCard.id, 0, "indicator", cardFace.color_indicator));
            }
          });

          return await runSerial<GenericSyncTaskParameter<"cardface_color_map", CardfaceColorMapAdapterParameter>>(
            taskParameters,
            async (param: GenericSyncTaskParameter<"cardface_color_map", CardfaceColorMapAdapterParameter>, index: number, total: number) => this.serialGenericDeleteAndRecreate(param, index, total)
          );
        } else {
          return Promise.resolve();
        }
      });
  }

  private createCardFaceColorMapTaskParameter(
    trx: Transaction<DatabaseSchema>,
    cardId: string,
    sequence: number,
    colorType: MTGColorType,
    colors: Array<MTGColor>
  ): GenericSyncTaskParameter<"cardface_color_map", CardfaceColorMapAdapterParameter> {
    return {
      trx: trx,
      tableName: "cardface_color_map",
      filter: (eb) => eb("cardface_color_map.card_id", "=", cardId)
        .and("cardface_color_map.sequence", "=", sequence)
        .and("cardface_color_map.color_type", "=", colorType), // cascaded delete should have removed old stuff
      adapter: this.cardfaceColorMapAdapter,
      scryfall: { cardId: cardId, sequence: sequence, colorType: colorType, colors: colors }
    };
  }

  private createCardColorMapTaskParameter(
    trx: Transaction<DatabaseSchema>,
    cardId: string,
    colorType: MTGColorType,
    colors: Array<MTGColor>
  ): GenericSyncTaskParameter<"card_color_map", CardColorMapAdapterParameter> {
    return {
      trx: trx,
      tableName: "card_color_map",
      filter: (eb) => eb("card_color_map.card_id", "=", cardId)
        .and("card_color_map.color_type", "=", colorType), // cascaded delete should have removed old stuff
      adapter: this.cardColorMapAdapter,
      scryfall: { cardId: cardId, colorType: colorType, colors: colors }
    };
  }

  private async syncCardCardMap(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<Array<DeleteResult> | InsertResult> {
    if (scryfallCard.all_parts?.length > 0) {
      this.logService.debug("Main", `${scryfallCard.name} ${scryfallCard.lang} - delete and recreate card_card_map`);
      return await this
        .genericDeleteAndRecreate(
          trx,
          "card_card_map",
          (eb) => eb("card_card_map.card_id", "=", scryfallCard.id),
          this.cardCardMapAdapter,
          { cardId: scryfallCard.id, relatedCards: scryfallCard.all_parts }
        );
    } else {
      this.logService.debug("Main", `${scryfallCard.name} ${scryfallCard.lang} - delete card_card_map`);
      return await trx
        .deleteFrom("card_card_map")
        .where("card_card_map.card_id", "=", scryfallCard.id)
        .execute();
    }
  }
  //#endregion

  //#region Post sync auxiliary methods ---------------------------------------
  private async processChangedImages(action: ChangedImageStatusAction, previousImageStatuses: Array<IdAndStatusSelectResult>, progressCallback: ProgressCallback): Promise<void> {
    await runSerial<IdAndStatusSelectResult>(
      previousImageStatuses,
      async (prev: IdAndStatusSelectResult, index: number, total: number) => {
        return this.database.selectFrom("card")
          .innerJoin("card_set", "card_set.id", "card.set_id")
          .select([
            "card.id as cardId",
            "card.collector_number as collectorNumber",
            "card.card_back_id as cardBackId",
            "card_set.code as setCode",
            "card.lang as language"
          ])
          .where("card.id", "=", prev.id)
          .where("card.image_status", "!=", prev.image_status)
          // .$call(this.logCompilable)
          .$castTo<DtoCardImageData>()
          .execute()
          .then(async (current: Array<DtoCardImageData>) => {
            progressCallback(`Processing image (${index}/${total})`);
            current.forEach(async (cardImageDto: DtoCardImageData) => {
              if (action == "delete") {
                this.imageCacheService.deleteCachedCardImage(cardImageDto);
              } else {
                await this.imageCacheService.cacheCardImage(cardImageDto, true);
              }
            });
          });
      }
    );
    return Promise.resolve();
  }
  //#endregion

  //#region Other auxiliary methods -------------------------------------------
  private convertLastSyncParameters(value: number, unit: TimespanUnit): Date {
    // this is very rudimentary...
    let date: number;
    switch (unit) {
      case "day":
        date = Date.now() - (24 * 60 * 60 * 1000);
        break;
      case "week":
        date = Date.now() - (7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        date = Date.now() - (30 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        date = Date.now() - (365 * 24 * 60 * 60 * 1000);
        break;
    }
    return new Date(date); // .toISOString();
  }
  //#endregion
}
