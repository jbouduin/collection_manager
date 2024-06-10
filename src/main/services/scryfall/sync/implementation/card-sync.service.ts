import { DeleteResult, InsertResult, Transaction, UpdateResult, sql } from "kysely";
import { inject, injectable } from "tsyringe";


import { DtoSyncParam, IdSelectResult, TimespanUnit } from "../../../../../common/dto";
import { GameFormat, MTGColor, MTGColorType } from "../../../../../common/enums";
import { CardSyncOptions, ProgressCallback } from "../../../../../common/ipc-params";
import { isSingleCardFaceLayout } from "../../../../../common/util";
import { DatabaseSchema } from "../../../../../main/database/schema";
import INFRATOKENS, { IConfigurationService, IDatabaseService } from "../../../../../main/services/infra/interfaces";
import { runSerial } from "../../../../../main/services/infra/util";
import ADAPTTOKENS, {
  ICardAdapter,
  ICardCardMapAdapter,
  ICardColorMapAdapter,
  ICardGameAdapter,
  ICardMultiverseIdAdapter, ICardfaceAdapter, ICardfaceColorMapAdapter,
  ICardfaceImageAdapter,
  IOracleAdapter,
  IOracleKeywordAdapter,
  IOracleLegalityAdapter
} from "../../adapt/interface";
import { CardColorMapAdapterParameter, CardFaceAdapterParameter, OracleAdapterParameter } from "../../adapt/interface/param";
import { CardfaceColorMapAdapterParameter } from "../../adapt/interface/param/cardface-color-map-adapter.param";
import { OracleLegalityAdapterParameter } from "../../adapt/interface/param/oracle-legality-adapter.param";
import CLIENTTOKENS, { IScryfallClient } from "../../client/interfaces";
import { ScryfallCard, ScryfallCardface, ScryfallImageUris, ScryfallLegalities } from "../../types";
import { ICardSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";
import { GenericSyncTaskParameter } from "./generic-sync-task.parameter";

@injectable()
export class CardSyncService extends BaseSyncService<CardSyncOptions> implements ICardSyncService {

  //#region Private readonly fields -------------------------------------------
  private readonly cardAdapter: ICardAdapter;
  private readonly cardColorMapAdapter: ICardColorMapAdapter;
  private readonly cardCardMapAdapter: ICardCardMapAdapter;
  private readonly cardGameAdapter: ICardGameAdapter;
  private readonly cardMultiverseIdAdapter: ICardMultiverseIdAdapter;
  private readonly cardfaceAdapter: ICardfaceAdapter;
  private readonly cardfaceColorMapAdapter: ICardfaceColorMapAdapter;
  private readonly cardfaceImageAdapter: ICardfaceImageAdapter;
  private readonly oracleAdapter: IOracleAdapter;
  private readonly oracleKeywordAdapter: IOracleKeywordAdapter;
  private readonly oracleLegalityAdapter: IOracleLegalityAdapter;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRATOKENS.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRATOKENS.ConfigurationService) configurationService: IConfigurationService,
    @inject(CLIENTTOKENS.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(ADAPTTOKENS.CardAdapter) cardAdapter: ICardAdapter,
    @inject(ADAPTTOKENS.CardColorMapAdapter) cardColorMapAdapter: ICardColorMapAdapter,
    @inject(ADAPTTOKENS.CardCardMapAdapter) cardCardMapAdapter: ICardCardMapAdapter,
    @inject(ADAPTTOKENS.CardGameAdapter) cardGameAdapter: ICardGameAdapter,
    @inject(ADAPTTOKENS.CardMultiverseIdAdapter) cardMultiverseIdAdapter: ICardMultiverseIdAdapter,
    @inject(ADAPTTOKENS.CardfaceAdapter) cardfaceAdapter: ICardfaceAdapter,
    @inject(ADAPTTOKENS.CardfaceColorMapAdapter) cardfaceColorMapAdapter: ICardfaceColorMapAdapter,
    @inject(ADAPTTOKENS.CardfaceImageAdapter) cardfaceImageAdapter: ICardfaceImageAdapter,
    @inject(ADAPTTOKENS.OracleAdapter) oracleAdapter: IOracleAdapter,
    @inject(ADAPTTOKENS.OracleKeywordAdapter) oracleKeywordAdapter: IOracleKeywordAdapter,
    @inject(ADAPTTOKENS.OracleLegalityAdapter) oracleLegalityAdapter: IOracleLegalityAdapter) {
    super(databaseService, configurationService, scryfallclient);
    this.cardAdapter = cardAdapter;
    this.cardColorMapAdapter = cardColorMapAdapter;
    this.cardCardMapAdapter = cardCardMapAdapter;
    this.cardGameAdapter = cardGameAdapter;
    this.cardMultiverseIdAdapter = cardMultiverseIdAdapter;
    this.cardfaceAdapter = cardfaceAdapter;
    this.cardfaceColorMapAdapter = cardfaceColorMapAdapter;
    this.cardfaceImageAdapter = cardfaceImageAdapter;
    this.oracleAdapter = oracleAdapter;
    this.oracleKeywordAdapter = oracleKeywordAdapter;
    this.oracleLegalityAdapter = oracleLegalityAdapter;
  }
  //#endregion

  //#region ICardSyncService methods ------------------------------------------
  public override async newSync(syncParam: DtoSyncParam, progressCallback: ProgressCallback): Promise<void> {
    let cards: Promise<Array<ScryfallCard>>;
    switch (syncParam.cardSyncType) {
      case "allCards":
        cards = this.database
          .selectFrom("card")
          .select("card.id")
          .execute()
          .then((results: Array<IdSelectResult>) =>
            this.scryfallclient.getCardCollections(
              results.map((result: IdSelectResult) => result.id),
              progressCallback
            )
          );
        break;
      case "byImageStatus":
        cards = this.database
          .selectFrom("card")
          .select("card.id")
          .where("card.image_status", "in", syncParam.cardImageStatusToSync)
          .execute()
          .then((results: Array<IdSelectResult>) =>
            this.scryfallclient.getCardCollections(
              results.map((result: IdSelectResult) => result.id),
              progressCallback
            )
          );
        break;
      case "byCardSet":
        cards = this.scryfallclient.getCardsForCardSet(syncParam.cardSetCodeToSyncCardsFor, progressCallback);
        break;
      case "byLastSynchronized":
        cards = this.database
          .selectFrom("card")
          .select("card.id")
          .where("card.last_synced_at", "<", sql.lit(this.convertLastSyncParameters(syncParam.syncCardsSyncedBeforeNumber, syncParam.syncCardsSyncedBeforeUnit)))
          .$call(this.logCompilable)
          .execute()
          .then((results: Array<IdSelectResult>) => {
            if (results.length > 0) {
              return this.scryfallclient.getCardCollections(
                results.map((result: IdSelectResult) => result.id),
                progressCallback
              );
            } else {
              return new Array<ScryfallCard>();
            }
          });
        break;
      case "collection":
        cards = this.scryfallclient.getCardCollections(syncParam.cardSelectionToSync, progressCallback);
        break;
    }
    return cards.then((cardArray: Array<ScryfallCard>) => {
      this.dumpScryFallData("cards.json", cardArray);
      return this.processSync(cardArray, progressCallback);
    }).then(() => {
      if (syncParam.cardSyncType == "byCardSet") {
        this.database
          .updateTable("card_set")
          .set({ last_full_synchronization_at: new Date().toISOString() })
          .where("card_set.code", "=", syncParam.cardSetCodeToSyncCardsFor)
          .executeTakeFirst();
      }
    });
  }

  public override async sync(_options: CardSyncOptions, _progressCallback: ProgressCallback): Promise<void> {
    throw new Error("not implemented");

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
    return this.database.transaction().execute(async (trx: Transaction<DatabaseSchema>) => {
      console.log(`${card.name} ${card.lang} = start sync ======================================`);
      if (progressCallback) {
        progressCallback(`Processing ${card.name} (${cnt}/${total})`);
      }
      console.log(`${card.name} ${card.lang} - single sync of card`);
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
    }).then(
      () => console.log(`${card.name} ${card.lang} = card synced =====================================`),
      (reason) => {
        console.log(`${card.name} ${card.lang} = failed !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        console.log(reason);
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
      (param: GenericSyncTaskParameter<"card_color_map", CardColorMapAdapterParameter>) =>
        `${scryfallCard.name} ${scryfallCard.lang} - card color map - ${param.scryfall.colorType} = ${param.scryfall.colors.join(", ")}`,
      async (param: GenericSyncTaskParameter<"card_color_map", CardColorMapAdapterParameter>, index: number, total: number) =>
        this.serialGenericDeleteAndRecreate(param, index, total)
    );
  }

  private async syncOracle(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<InsertResult | UpdateResult | void> {
    if (isSingleCardFaceLayout(scryfallCard.layout)) {
      console.log(`${scryfallCard.name} ${scryfallCard.lang} - single sync of oracle`);
      return await this.genericSingleSync(
        trx,
        "oracle",
        (eb) => eb("oracle.oracle_id", "=", scryfallCard.oracle_id).and("oracle.face_sequence", "=", 0),
        this.oracleAdapter,
        { oracleId: scryfallCard.oracle_id, sequence: 0, scryfallCard: scryfallCard }
      );
    } else {
      console.log(`${scryfallCard.name} ${scryfallCard.lang} - single sync of oracle for split card`);
      const uniqueOracleIds = scryfallCard.layout != "reversible_card" ?
        scryfallCard.card_faces :
        [...new Map(scryfallCard.card_faces.map((cardface: ScryfallCardface) => [cardface.oracle_id, cardface])).values()];
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
        (param: GenericSyncTaskParameter<"oracle", OracleAdapterParameter>) =>
          `${scryfallCard.name} ${scryfallCard.lang} - oracle - ${param.scryfall.oracleId} = ${param.scryfall.scryfallCardFace.name}`,
        async (param: GenericSyncTaskParameter<"oracle", OracleAdapterParameter>, index: number, total: number) =>
          super.serialGenericSingleSync(param, index, total)
      );
    }
  }

  private async syncOracleKeywords(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<Array<DeleteResult> | InsertResult> {
    if (scryfallCard.keywords?.length > 0 && scryfallCard.oracle_id) { // TODO cover reversible_card here also
      console.log(`${scryfallCard.name} ${scryfallCard.lang} - delete and recreate oracle_keyword`);
      return await this.genericDeleteAndRecreate(
        trx,
        "oracle_keyword",
        (eb) => eb("oracle_keyword.oracle_id", "=", scryfallCard.oracle_id),
        this.oracleKeywordAdapter,
        { oracle_id: scryfallCard.oracle_id, keywords: scryfallCard.keywords }
      );
    } else {
      console.log(`${scryfallCard.name} ${scryfallCard.lang} - delete oracle_keyword`);
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
          const uniqueOracleIds = scryfallCard.layout != "reversible_card" ?
            [...new Map(scryfallCard.card_faces.map((cardface: ScryfallCardface) => [cardface.oracle_id, cardface])).values()] :
            scryfallCard.card_faces;
          uniqueOracleIds.forEach((cardface: ScryfallCardface) =>
            taskParameters.push({
              trx: trx,
              tableName: "oracle_legality",
              filter: (eb) => eb("oracle_legality.oracle_id", "=", cardface.oracle_id).and("oracle_legality.format", "=", key as GameFormat),
              adapter: this.oracleLegalityAdapter,
              scryfall: {
                oracle_id: cardface.oracle_id,
                gameFormat: key as GameFormat,
                legality: scryfallCard.legalities[key as keyof ScryfallLegalities]
              }
            })
          );
        }
      });

      return await runSerial<GenericSyncTaskParameter<"oracle_legality", OracleLegalityAdapterParameter>>(
        taskParameters,
        (param: GenericSyncTaskParameter<"oracle_legality", OracleLegalityAdapterParameter>) =>
          `${scryfallCard.name} ${scryfallCard.lang} - oracle legality - ${param.scryfall.gameFormat} = ${param.scryfall.legality}`,
        async (param: GenericSyncTaskParameter<"oracle_legality", OracleLegalityAdapterParameter>, index: number, total: number) =>
          super.serialGenericSingleSync(param, index, total)
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
      console.log(`${scryfallCard.name} ${scryfallCard.lang} - delete and recreate card_game`);
      return await this
        .genericDeleteAndRecreate(
          trx,
          "card_game",
          (eb) => eb("card_game.card_id", "=", scryfallCard.id),
          this.cardGameAdapter,
          { card_id: scryfallCard.id, games: scryfallCard.games }
        );
    } else {
      console.log(`${scryfallCard.name} ${scryfallCard.lang} - delete oracle_keyword`);
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
        console.log(`${scryfallCard.name} ${scryfallCard.lang} - delete and recreate cardface_images`);
        const cardfaceImagesMap = new Map<number, ScryfallImageUris>();
        if (isSingleCardFaceLayout(scryfallCard.layout) || scryfallCard.layout == "split" || scryfallCard.layout == "flip" || scryfallCard.layout == "adventure") {
          cardfaceImagesMap.set(0, scryfallCard.image_uris);
        }
        else {
          scryfallCard.card_faces.forEach((cardface: ScryfallCardface, idx: number) =>
            cardfaceImagesMap.set(idx, cardface.image_uris)
          );
        }
        return await this.genericDeleteAndRecreate(
          trx,
          "cardface_image",
          (eb) => eb("cardface_image.card_id", "=", scryfallCard.id), // TODO not required because of cascaded delete
          this.cardfaceImageAdapter,
          { cardId: scryfallCard.id, images: cardfaceImagesMap }
        );
      })
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
            (param: GenericSyncTaskParameter<"cardface_color_map", CardfaceColorMapAdapterParameter>) =>
              `${scryfallCard.name} ${scryfallCard.lang} - cardface color map - ${param.scryfall.colorType}}`,
            async (param: GenericSyncTaskParameter<"cardface_color_map", CardfaceColorMapAdapterParameter>, index: number, total: number) =>
              this.serialGenericDeleteAndRecreate(param, index, total)
          );
        }
        else {
          return Promise.resolve();
        }
      });
    // }
  }

  private createCardFaceColorMapTaskParameter(
    trx: Transaction<DatabaseSchema>,
    cardId: string,
    sequence: number,
    colorType: MTGColorType,
    colors: Array<MTGColor>): GenericSyncTaskParameter<"cardface_color_map", CardfaceColorMapAdapterParameter> {
    return {
      trx: trx,
      tableName: "cardface_color_map",
      filter: (eb) => eb("cardface_color_map.card_id", "=", cardId)
        .and("cardface_color_map.sequence", "=", sequence)
        .and("cardface_color_map.color_type", "=", colorType), // TODO useless as cascaded delete should have removed old stuff
      adapter: this.cardfaceColorMapAdapter,
      scryfall: { cardId: cardId, sequence: sequence, colorType: colorType, colors: colors }
    };
  }

  private createCardColorMapTaskParameter(
    trx: Transaction<DatabaseSchema>,
    cardId: string,
    colorType: MTGColorType,
    colors: Array<MTGColor>): GenericSyncTaskParameter<"card_color_map", CardColorMapAdapterParameter> {
    return {
      trx: trx,
      tableName: "card_color_map",
      filter: (eb) => eb("card_color_map.card_id", "=", cardId)
        .and("card_color_map.color_type", "=", colorType), // TODO useless as cascaded delete should have removed old stuff
      adapter: this.cardColorMapAdapter,
      scryfall: { cardId: cardId, colorType: colorType, colors: colors }
    };
  }

  private async syncCardCardMap(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<Array<DeleteResult> | InsertResult> {
    if (scryfallCard.all_parts?.length > 0) {
      console.log(`${scryfallCard.name} ${scryfallCard.lang} - delete and recreate card_card_map`);
      return await this
        .genericDeleteAndRecreate(
          trx,
          "card_card_map",
          (eb) => eb("card_card_map.card_id", "=", scryfallCard.id),
          this.cardCardMapAdapter,
          { cardId: scryfallCard.id, relatedCards: scryfallCard.all_parts }
        );
    } else {
      console.log(`${scryfallCard.name} ${scryfallCard.lang} - delete card_card_map`);
      return await trx
        .deleteFrom("card_card_map")
        .where("card_card_map.card_id", "=", scryfallCard.id)
        .execute();
    }
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
    return new Date(date); //.toISOString();
  }
  //#endregion
}
