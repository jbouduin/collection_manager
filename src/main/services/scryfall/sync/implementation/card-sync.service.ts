import fs from "fs";
import { DeleteResult, InsertResult, Transaction, UpdateResult } from "kysely";
import { inject, injectable } from "tsyringe";
import { v1 as uuidV1 } from "uuid";

import { GameFormat } from "../../../../../common/enums";
import { CardSyncOptions, ProgressCallback } from "../../../../../common/ipc-params";
import { isSingleCardFaceLayout } from "../../../../../common/util";
import { DatabaseSchema } from "../../../../../main/database/schema";
import INFRATOKENS, { IDatabaseService } from "../../../../../main/services/infra/interfaces";
import { runSerial } from "../../../../../main/services/infra/util";
import ADAPTTOKENS, {
  ICardAdapter,
  ICardCardMapAdapter,
  ICardGameAdapter,
  ICardMultiverseIdAdapter, ICardfaceAdapter, ICardfaceColorMapAdapter,
  ICardfaceImageAdapter,
  IOracleAdapter,
  IOracleKeywordAdapter,
  IOracleLegalityAdapter
} from "../../adapt/interface";
import { CardfaceColorMapAdapterParameter } from "../../adapt/interface/param/cardface-color-map-adapter.param";
import { OracleLegalityAdapterParameter } from "../../adapt/interface/param/oracle-legality-adapter.param";
import CLIENTTOKENS, { IScryfallClient } from "../../client/interfaces";
import { ScryfallCard, ScryfallLegalities } from "../../types";
import { ICardSyncService } from "../interface";
import { BaseSyncService } from "./base-sync.service";
import { GenericSyncTaskParameter } from "./generic-sync-task.parameter";


// NOW some cards are missing (only available in one language or not at all, latter could be a split card
@injectable()
export class CardSyncService extends BaseSyncService<CardSyncOptions> implements ICardSyncService {

  //#region Private readonly fields -------------------------------------------
  private readonly scryfallclient: IScryfallClient;
  private readonly cardAdapter: ICardAdapter;
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
    @inject(CLIENTTOKENS.ScryfallClient) scryfallclient: IScryfallClient,
    @inject(ADAPTTOKENS.CardAdapter) cardAdapter: ICardAdapter,
    @inject(ADAPTTOKENS.CardCardMapAdapter) cardCardMapAdapter: ICardCardMapAdapter,
    @inject(ADAPTTOKENS.CardGameAdapter) cardGameAdapter: ICardGameAdapter,
    @inject(ADAPTTOKENS.CardMultiverseIdAdapter) cardMultiverseIdAdapter: ICardMultiverseIdAdapter,
    @inject(ADAPTTOKENS.CardfaceAdapter) cardfaceAdapter: ICardfaceAdapter,
    @inject(ADAPTTOKENS.CardfaceColorMapAdapter) cardfaceColorMapAdapter: ICardfaceColorMapAdapter,
    @inject(ADAPTTOKENS.CardfaceImageAdapter) cardfaceImageAdapter: ICardfaceImageAdapter,
    @inject(ADAPTTOKENS.OracleAdapter) oracleAdapter: IOracleAdapter,
    @inject(ADAPTTOKENS.OracleKeywordAdapter) oracleKeywordAdapter: IOracleKeywordAdapter,
    @inject(ADAPTTOKENS.OracleLegalityAdapter) oracleLegalityAdapter: IOracleLegalityAdapter) {
    super(databaseService);
    this.scryfallclient = scryfallclient;
    this.cardAdapter = cardAdapter;
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
  public override async sync(options: CardSyncOptions, progressCallback: ProgressCallback): Promise<void> {
    console.log("start CardSyncService.sync");
    if (progressCallback) {
      progressCallback("Sync cards");
    }
    // TODO: check if all required master data is available
    const cards = this.scryfallclient.getCards(options);
    return cards.then((cardArray: Array<ScryfallCard>) => {
        fs.writeFileSync("c:/data/new-assistant/json/cards_" + options.setCode + ".json", JSON.stringify(cardArray, null, 2));
      console.log("Found %d cards", cardArray.length);
      return this.processSync(cardArray, progressCallback);
    });
  }
  //#endregion

  //#region private sync methods ----------------------------------------------
  private async processSync(cards: Array<ScryfallCard>, progressCallback?: ProgressCallback): Promise<void> {
    const total = cards.length;
    let cnt = 0;
    return Promise
      .all(cards
        .filter((card:ScryfallCard) => isSingleCardFaceLayout(card.layout))
        .map((card: ScryfallCard) => this.syncSingleCard(card, ++cnt, total, progressCallback))
      )
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
        .then(async () => await this.syncCardCardMap(trx, card))
        .then(async () => await this.syncOracle(trx, card))
        .then(async () => await this.syncOracleKeywords(trx, card))
        .then(async () => await this.syncOracleLegalities(trx, card))
        .then(async () => await this.syncCardGames(trx, card))
        .then(async () => await this.syncMultiversIds(trx, card))
        .then(async () => await this.syncCardFaces(trx, card));
    }).then(
      () => console.log(`${card.name} ${card.lang} = card synced =====================================`),
      (reason) => {
        console.log(`${card.name} ${card.lang} = failed !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        console.log(reason);
      }
    );
  }

  private async syncOracle(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<InsertResult | UpdateResult | void> {
    if (isSingleCardFaceLayout(scryfallCard.layout)) {
      console.log(`${scryfallCard.name} ${scryfallCard.lang} - single sync of oracle`);
      return await this.genericSingleSync(
        trx,
        "oracle",
        (eb) => eb("oracle.oracle_id", "=", scryfallCard.oracle_id).and("oracle.face_name", "=", scryfallCard.name),
        this.oracleAdapter,
        { faceName: scryfallCard.name, scryfallCard: scryfallCard }
      );
    } else {
      return Promise.resolve();
    }
  }

  private async syncOracleKeywords(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<Array<DeleteResult> | InsertResult | void> {
    if (scryfallCard.keywords?.length > 0) {
      if (isSingleCardFaceLayout(scryfallCard.layout)) {
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
    } else {
      console.log(`${scryfallCard.name} ${scryfallCard.lang} - skip oracle_keyword`);
      return Promise.resolve();
    }
  }

  private async syncOracleLegalities(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<void> {
    if (scryfallCard.legalities) {
      const taskParameters = new Array<GenericSyncTaskParameter<"oracle_legality", OracleLegalityAdapterParameter>>();
      Object.keys(scryfallCard.legalities).forEach((key: string) =>
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
        })
      );

      if (isSingleCardFaceLayout(scryfallCard.layout)) {
        return await runSerial<GenericSyncTaskParameter<"oracle_legality", OracleLegalityAdapterParameter>>(
          taskParameters,
          (param: GenericSyncTaskParameter<"oracle_legality", OracleLegalityAdapterParameter>) =>
            `${scryfallCard.name} ${scryfallCard.lang} - oracle legality - ${param.scryfall.gameFormat} = ${param.scryfall.legality}`,
          async (param: GenericSyncTaskParameter<"oracle_legality", OracleLegalityAdapterParameter>, index: number, total: number) =>
            super.serialGenericSingleSync(param, index, total)
        );
      } else {
        return Promise.resolve();
      }
    } else {
      return Promise.resolve();
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

  private async syncMultiversIds(trx: Transaction<DatabaseSchema>, scryfallCard: ScryfallCard): Promise<Array<DeleteResult> | InsertResult> {
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
    if (isSingleCardFaceLayout(scryfallCard.layout)) {
      const cardfaceUuid = uuidV1();
      await this
        .genericDeleteAndRecreate(
          trx,
          "cardface",
          (eb) => eb("cardface.card_id", "=", scryfallCard.id),
          this.cardfaceAdapter,
          { uuid: cardfaceUuid, faceName: scryfallCard.name, scryfallCard: scryfallCard }
        )
        .then(async () => {
          const taskParameters = new Array<GenericSyncTaskParameter<"cardface_color_map", CardfaceColorMapAdapterParameter>>();

          if (scryfallCard.colors?.length > 0) {
            taskParameters.push({
              trx: trx,
              tableName: "cardface_color_map",
              filter: (eb) => eb("cardface_color_map.cardface_id", "=", cardfaceUuid), // TODO useless as cascaded delete should have removed old stuff
              adapter: this.cardfaceColorMapAdapter,
              scryfall: { cardfaceId: cardfaceUuid, colorType: "card", colors: scryfallCard.colors }
            });
          }

          if (scryfallCard.color_identity?.length > 0) {
            taskParameters.push({
              trx: trx,
              tableName: "cardface_color_map",
              filter: (eb) => eb("cardface_color_map.cardface_id", "=", cardfaceUuid),
              adapter: this.cardfaceColorMapAdapter,
              scryfall: { cardfaceId: cardfaceUuid, colorType: "identity", colors: scryfallCard.color_identity }
            });
          }

          if (scryfallCard.color_indicator?.length > 0) {
            taskParameters.push({
              trx: trx,
              tableName: "cardface_color_map",
              filter: (eb) => eb("cardface_color_map.cardface_id", "=", cardfaceUuid),
              adapter: this.cardfaceColorMapAdapter,
              scryfall: { cardfaceId: cardfaceUuid, colorType: "indicator", colors: scryfallCard.color_indicator }
            });
          }

          if (scryfallCard.produced_mana?.length > 0) {
            taskParameters.push({
              trx: trx,
              tableName: "cardface_color_map",
              filter: (eb) => eb("cardface_color_map.cardface_id", "=", cardfaceUuid),
              adapter: this.cardfaceColorMapAdapter,
              scryfall: { cardfaceId: cardfaceUuid, colorType: "produced_mana", colors: scryfallCard.produced_mana }
            });
          }

          await runSerial<GenericSyncTaskParameter<"cardface_color_map", CardfaceColorMapAdapterParameter>>(
            taskParameters,
            (param: GenericSyncTaskParameter<"cardface_color_map", CardfaceColorMapAdapterParameter>) =>
              `${scryfallCard.name} ${scryfallCard.lang} - cardface color map - ${param.scryfall.colorType} = ${param.scryfall.colors.join(", ")}`,
            async (param: GenericSyncTaskParameter<"cardface_color_map", CardfaceColorMapAdapterParameter>, index: number, total: number) =>
              this.serialGenericDeleteAndRecreate(param, index, total)
          ).then(async () => {
            console.log(`${scryfallCard.name} ${scryfallCard.lang} - delete and recreate cardface_image`);
            await this.genericDeleteAndRecreate(
              trx,
              "cardface_image",
              (eb) => eb("cardface_image.cardface_id", "=", cardfaceUuid), // TODO not required because of cascaded delete
              this.cardfaceImageAdapter,
              { cardfaceId: cardfaceUuid, scryfallCard: scryfallCard }
            );
          });
        });
    }
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
}
