import * as fs from "fs";
import { inject, injectable } from "tsyringe";
import { ICardQueryDto, ICatalogItemDto, IMtgCardDetailDto, IMtgCardImageDataDto, IMtgCardListDto } from "../../../../common/dto";
import { CatalogType, MtgColor } from "../../../../common/types";
import { IResult } from "../../../services/base";
import { IDatabaseService, ILogService, IResultFactory } from "../../../services/infra/interfaces";
import { INFRASTRUCTURE } from "../../../services/service.tokens";
import { logCompilable } from "../../log-compilable";
import { CARD_TABLE_FIELDS } from "../../schema";
import { ICardRepository } from "../interfaces";
import { BaseRepository } from "./base.repository";
import { $cardColors, $cardFaces, $cardLanguages, $oracle } from "./helpers";


@injectable()
export class CardRepository extends BaseRepository implements ICardRepository {
  //#region Constructor & C° --------------------------------------------------
  public constructor(
    @inject(INFRASTRUCTURE.DatabaseService) databaseService: IDatabaseService,
    @inject(INFRASTRUCTURE.LogService) logService: ILogService,
    @inject(INFRASTRUCTURE.ResultFacotry) resultFactory: IResultFactory
  ) {
    super(databaseService, logService, resultFactory);
  }
  //#endregion

  //#region ICardRepository methods -------------------------------------------
  /* eslint-disable @stylistic/function-paren-newline */
  public async getCardDetails(cardId: string): Promise<IResult<IMtgCardDetailDto>> {
    try {
      return await this.database
        .selectFrom("card")
        .select((eb) => [
          ...CARD_TABLE_FIELDS,
          $cardFaces(eb.ref("card.id")).as("cardfaces"),
          $oracle(eb.ref("card.oracle_id")).as("oracle"),
          $cardLanguages(eb.ref("card.set_id"), eb.ref("card.collector_number")).as("languages"),
          $cardColors(eb.ref("card.id")).as("cardColors")
        ])
        .where("card.id", "=", cardId)
        // .$call(this.logCompilable)
        .$castTo<IMtgCardDetailDto>()
        .executeTakeFirst()
        .then((qryResult: IMtgCardDetailDto) => {
          fs.writeFileSync("c:/data/new-assistant/json/getCardDetails.json", JSON.stringify(qryResult, null, 2));
          return this.resultFactory.createSuccessResult<IMtgCardDetailDto>(qryResult);
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<IMtgCardDetailDto>(err);
    }
  }

  public async getCardImageData(cardId: string): Promise<IResult<IMtgCardImageDataDto>> {
    try {
      return this.database.selectFrom("card")
        .innerJoin("card_set", "card_set.id", "card.set_id")
        .select([
          "card.id as cardId",
          "card.collector_number as collectorNumber",
          "card.card_back_id as cardBackId",
          "card_set.code as setCode",
          "card.lang as language"
        ])
        .where("card.id", "=", cardId)
        .$castTo<IMtgCardImageDataDto>()
        // .$call(this.logCompilable)
        .executeTakeFirst()
        .then((r: IMtgCardImageDataDto) => {
          return r != undefined
            ? this.resultFactory.createSuccessResult<IMtgCardImageDataDto>(r)
            : this.resultFactory.createNotFoundResult<IMtgCardImageDataDto>("card(s)");
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<IMtgCardImageDataDto>(err);
    }
  }

  public async queryCards(params: ICardQueryDto): Promise<IResult<Array<IMtgCardListDto>>> {
    try {
      return await this.database
        .selectFrom("card")
        .select((eb) => [
          ...CARD_TABLE_FIELDS,
          $cardFaces(eb.ref("card.id")).as("cardfaces"),
          $oracle(eb.ref("card.oracle_id")).as("oracle"),
          $cardLanguages(eb.ref("card.set_id"), eb.ref("card.collector_number")).as("languages"),
          $cardColors(eb.ref("card.id")).as("cardColors")
        ])
        .$if(params.selectedSets?.length > 0, (sqb) => sqb.where("card.set_id", "in", params.selectedSets))
        .$if(params.selectedRarities?.length > 0, (sqb) => sqb.where("card.rarity", "in", params.selectedRarities))
        .$if( // catalogs referring to oracle
          this.hasAnyCatalogItem(params.selectedCatalogItems, "card-names") ||
          this.hasAnyCatalogItem(params.selectedCatalogItems, "word-bank") ||
          this.hasAnyCatalogItem(params.selectedCatalogItems, "supertypes") ||
          this.hasAnyCatalogItem(params.selectedCatalogItems, "card-types") ||
          this.hasAnyCatalogItem(params.selectedCatalogItems, "artifact-types") ||
          this.hasAnyCatalogItem(params.selectedCatalogItems, "creature-types") ||
          this.hasAnyCatalogItem(params.selectedCatalogItems, "enchantment-types") ||
          this.hasAnyCatalogItem(params.selectedCatalogItems, "land-types") ||
          this.hasAnyCatalogItem(params.selectedCatalogItems, "planeswalker-types") ||
          this.hasAnyCatalogItem(params.selectedCatalogItems, "spell-types") ||
          this.hasAnyCatalogItem(params.selectedCatalogItems, "keyword-abilities") ||
          this.hasAnyCatalogItem(params.selectedCatalogItems, "keyword-actions"),
          (sqb) => sqb.where((eb) => eb.exists(eb
            .selectFrom("oracle as o2")
            .select("o2.oracle_id")
            .whereRef("o2.oracle_id", "=", "card.oracle_id")
            .where((eb) => eb.or([
              ...this.extractCatalogItems(params.selectedCatalogItems, "card-names").map((item: string) => eb("o2.oracle_name", "=", item)),
              ...this.extractCatalogItems(params.selectedCatalogItems, "word-bank").map((item: string) => eb("o2.oracle_name", "like", `%${item}%`)),
              ...this.extractCatalogItems(params.selectedCatalogItems, "supertypes").map((item: string) => eb("o2.type_line", "like", `%${item}%`)),
              ...this.extractCatalogItems(params.selectedCatalogItems, "card-types").map((item: string) => eb("o2.type_line", "like", `%${item}%`)),
              ...this.extractCatalogItems(params.selectedCatalogItems, "artifact-types").map((item: string) => eb("o2.type_line", "like", `%${item}%`)),
              ...this.extractCatalogItems(params.selectedCatalogItems, "creature-types").map((item: string) => eb("o2.type_line", "like", `%${item}%`)),
              ...this.extractCatalogItems(params.selectedCatalogItems, "enchantment-types").map((item: string) => eb("o2.type_line", "like", `%${item}%`)),
              ...this.extractCatalogItems(params.selectedCatalogItems, "land-types").map((item: string) => eb("o2.type_line", "like", `%${item}%`)),
              ...this.extractCatalogItems(params.selectedCatalogItems, "planeswalker-types").map((item: string) => eb("o2.type_line", "like", `%${item}%`)),
              ...this.extractCatalogItems(params.selectedCatalogItems, "spell-types").map((item: string) => eb("o2.type_line", "like", `%${item}%`)),
              ...this.extractCatalogItems(params.selectedCatalogItems, "keyword-abilities").map((item: string) => eb("o2.oracle_text", "like", `%${item}%`)),
              ...this.extractCatalogItems(params.selectedCatalogItems, "keyword-actions").map((item: string) => eb("o2.oracle_text", "like", `%${item}%`))
            ]))
          ))
        )
        .$if( // catalogs referring to cardfaces
          this.hasAnyCatalogItem(params.selectedCatalogItems, "artist-names") || this.hasAnyCatalogItem(params.selectedCatalogItems, "watermarks"),
          (sqb) => sqb.where((eb) => eb.exists(eb
            .selectFrom("cardface as cf2")
            .select("cf2.card_id")
            .whereRef("cf2.card_id", "=", "card.id")
            .where((eb) => eb.or([
              eb("cf2.artist", "in", this.extractCatalogItems(params.selectedCatalogItems, "artist-names")),
              eb("cf2.watermark", "in", this.extractCatalogItems(params.selectedCatalogItems, "watermarks"))
            ]))
          ))
        )
        .$if( // game format
          params.selectedGameFormats?.length > 0,
          (sqb) => sqb.where((eb) => eb.exists(eb
            .selectFrom("oracle_legality as ol")
            .select("ol.legality")
            .whereRef("ol.oracle_id", "=", "card.oracle_id")
            .where("ol.format", "in", params.selectedGameFormats)
            .where("ol.legality", "in", ["legal", "restricted"])
          ))
        )
        .$if( // owned cards
          params.ownedCards,
          (sqb) => sqb.where((eb) => eb.exists(eb
            .selectFrom("owned_card as oc2")
            .select("oc2.card_id")
            .whereRef("oc2.card_id", "=", "card.id")
          ))
        )
        .$if( // params.selectedCardColors?.length == 1 && params.selectedCardColors[0] == "C"
          params.selectedCardColors?.length == 1 && params.selectedCardColors[0] == "C",
          (sqb) => sqb.where((eb) => eb.not(eb.exists(eb
            .selectFrom("card_color_map as ccm")
            .select("ccm.color_id")
            .whereRef("ccm.card_id", "=", "card.id")
            .where("ccm.color_type", "=", "identity"))))
        )
        .$if( // params.selectedCardColors?.length == 1 && params.selectedCardColors[0] != "C"
          params.selectedCardColors?.length == 1 && params.selectedCardColors[0] != "C",
          (sqb) => sqb.where((eb) => eb
            .exists(eb
              .selectFrom("card_color_map as ccm")
              .select("ccm.color_id")
              .whereRef("ccm.card_id", "=", "card.id")
              .where("ccm.color_type", "=", "identity")
              .where("ccm.color_id", "=", params.selectedCardColors[0])))
        )
        .$if( // params.selectedCardColors?.length > 1 && !params.selectedCardColors.includes("C")
          params.selectedCardColors?.length > 1 && !params.selectedCardColors.includes("C"),
          (sqb) => sqb.where((eb) => eb.exists(eb
            .selectFrom("card_color_map as ccm")
            .select("ccm.color_id")
            .whereRef("ccm.card_id", "=", "card.id")
            .where("ccm.color_type", "=", "identity")
            .where("ccm.color_id", "in", params.selectedCardColors)))
        )
        .$if( // params.selectedCardColors?.length > 1 && params.selectedCardColors.includes("C")
          params.selectedCardColors?.length > 1 && params.selectedCardColors.includes("C"),
          (sqb) => sqb.where((eb) => eb
            .or([
              eb.exists(eb
                .selectFrom("card_color_map as ccm")
                .select("ccm.color_id")
                .whereRef("ccm.card_id", "=", "card.id")
                .where("ccm.color_type", "=", "identity")
                .where("ccm.color_id", "in", params.selectedCardColors.filter((c: MtgColor) => c != "C"))),
              eb.not(eb.exists(eb
                .selectFrom("card_color_map as ccm")
                .select("ccm.color_id")
                .whereRef("ccm.card_id", "=", "card.id")
                .where("ccm.color_type", "=", "identity")))
            ])
          )
        )
        .$if( // params.selectedIdentityColors?.length == 1 && params.selectedIdentityColors[0] == "C"
          params.selectedIdentityColors?.length == 1 && params.selectedIdentityColors[0] == "C",
          (sqb) => sqb.where((eb) => eb.not(eb.exists(eb
            .selectFrom("card_color_map as ccm")
            .select("ccm.color_id")
            .whereRef("ccm.card_id", "=", "card.id")
            .where("ccm.color_type", "=", "identity"))))
        )
        .$if( // params.selectedIdentityColors?.length == 1 && params.selectedIdentityColors[0] != "C"
          params.selectedIdentityColors?.length == 1 && params.selectedIdentityColors[0] != "C",
          (sqb) => sqb.where((eb) => eb
            .exists(eb
              .selectFrom("card_color_map as ccm")
              .select("ccm.color_id")
              .whereRef("ccm.card_id", "=", "card.id")
              .where("ccm.color_type", "=", "identity")
              .where("ccm.color_id", "=", params.selectedIdentityColors[0])))
        )
        .$if( // params.selectedIdentityColors?.length > 1 && !params.selectedIdentityColors.includes("C")
          params.selectedIdentityColors?.length > 1 && !params.selectedIdentityColors.includes("C"),
          (sqb) => sqb.where((eb) => eb.exists(eb
            .selectFrom("card_color_map as ccm")
            .select("ccm.color_id")
            .whereRef("ccm.card_id", "=", "card.id")
            .where("ccm.color_type", "=", "identity")
            .where("ccm.color_id", "in", params.selectedIdentityColors)))
        )
        .$if( // params.selectedIdentityColors?.length > 1 && params.selectedIdentityColors.includes("C")
          params.selectedIdentityColors?.length > 1 && params.selectedIdentityColors.includes("C"),
          (sqb) => sqb.where((eb) => eb
            .or([
              eb.exists(eb
                .selectFrom("card_color_map as ccm")
                .select("ccm.color_id")
                .whereRef("ccm.card_id", "=", "card.id")
                .where("ccm.color_type", "=", "identity")
                .where("ccm.color_id", "in", params.selectedIdentityColors.filter((c: MtgColor) => c != "C"))),
              eb.not(eb.exists(eb
                .selectFrom("card_color_map as ccm")
                .select("ccm.color_id")
                .whereRef("ccm.card_id", "=", "card.id")
                .where("ccm.color_type", "=", "identity")))
            ])
          )
        )
        .$if( // params.selectedProducedManaColors?.length == 1 && params.selectedProducedManaColors[0] == "C"
          params.selectedProducedManaColors?.length == 1 && params.selectedProducedManaColors[0] == "C",
          (sqb) => sqb.where((eb) => eb.not(eb.exists(eb
            .selectFrom("card_color_map as ccm")
            .select("ccm.color_id")
            .whereRef("ccm.card_id", "=", "card.id")
            .where("ccm.color_type", "=", "produced_mana"))))
        )
        .$if( // params.selectedProducedManaColors?.length == 1 && params.selectedProducedManaColors[0] != "C"
          params.selectedProducedManaColors?.length == 1 && params.selectedProducedManaColors[0] != "C",
          (sqb) => sqb.where((eb) => eb
            .exists(eb
              .selectFrom("card_color_map as ccm")
              .select("ccm.color_id")
              .whereRef("ccm.card_id", "=", "card.id")
              .where("ccm.color_type", "=", "produced_mana")
              .where("ccm.color_id", "=", params.selectedProducedManaColors[0])))
        )
        .$if( // params.selectedProducedManaColors?.length > 1 && !params.selectedProducedManaColors.includes("C")
          params.selectedProducedManaColors?.length > 1 && !params.selectedProducedManaColors.includes("C"),
          (sqb) => sqb.where((eb) => eb.exists(eb
            .selectFrom("card_color_map as ccm")
            .select("ccm.color_id")
            .whereRef("ccm.card_id", "=", "card.id")
            .where("ccm.color_type", "=", "produced_mana")
            .where("ccm.color_id", "in", params.selectedProducedManaColors)))
        )
        .$if( // params.selectedProducedManaColors?.length > 1 && params.selectedProducedManaColors.includes("C")
          params.selectedProducedManaColors?.length > 1 && params.selectedProducedManaColors.includes("C"),
          (sqb) => sqb.where((eb) => eb
            .or([
              eb.exists(eb
                .selectFrom("card_color_map as ccm")
                .select("ccm.color_id")
                .whereRef("ccm.card_id", "=", "card.id")
                .where("ccm.color_type", "=", "produced_mana")
                .where("ccm.color_id", "in", params.selectedProducedManaColors.filter((c: MtgColor) => c != "C"))),
              eb.not(eb.exists(eb
                .selectFrom("card_color_map as ccm")
                .select("ccm.color_id")
                .whereRef("ccm.card_id", "=", "card.id")
                .where("ccm.color_type", "=", "produced_mana")))
            ])
          )
        )
        .$if( // params.selectedProducedManaColors?.length > 0
          params.selectedProducedManaColors?.length > 0,
          (sqb) => sqb.where((eb) => eb
            .exists(eb
              .selectFrom("card_color_map as ccm")
              .select("ccm.color_id")
              .whereRef("ccm.card_id", "=", "card.id")
              .where("ccm.color_type", "=", "produced_mana")
              .where("ccm.color_id", "in", params.selectedProducedManaColors))
          )
        )
        .$call((sqb) => logCompilable(this.logService, sqb))
        .$castTo<IMtgCardListDto>()
        .groupBy(["card.set_id", "card.collector_number"])
        .orderBy(["card.set_id", "card.collector_number"])
        .execute()
        .then((qryResult: Array<IMtgCardListDto>) => {
          fs.writeFileSync("c:/data/new-assistant/json/queryCards.json", JSON.stringify(qryResult, null, 2));
          return this.resultFactory.createSuccessResult<Array<IMtgCardListDto>>(qryResult);
        });
    } catch (err) {
      return this.resultFactory.createExceptionResultPromise<Array<IMtgCardListDto>>(err);
    }
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  private hasAnyCatalogItem(allSelected: Array<ICatalogItemDto>, catalog: CatalogType): boolean {
    return allSelected.findIndex((f: ICatalogItemDto) => f.catalog_name == catalog) >= 0;
  }

  private extractCatalogItems(allSelected: Array<ICatalogItemDto>, catalog: CatalogType): Array<string> {
    return allSelected.filter((f: ICatalogItemDto) => f.catalog_name == catalog).map((f: ICatalogItemDto) => f.item);
  }
  //#endregion
}
