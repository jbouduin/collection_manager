import { Expression, expressionBuilder } from "kysely";
import * as helpers from "kysely/helpers/sqlite";
import { CardfaceColorDto, MtgCardColorDto, MtgCardfaceDto, MtgCardLanguageDto, OracleDto } from "../../../../../common/dto";
import { CARD_COLOR_MAP_TABLE_FIELDS, CARDFACE_COLOR_MAP_TABLE_FIELDS, CARDFACE_TABLE_FIELDS, DatabaseSchema, ORACLE_TABLE_FIELDS } from "../../../schema";


/* eslint-disable @stylistic/function-paren-newline */
export function $cardColors(cardIdReference: Expression<string>) {
  const eb = expressionBuilder<DatabaseSchema, never>();
  return helpers.jsonArrayFrom<MtgCardColorDto>(eb
    .selectFrom("card_color_map")
    .innerJoin("color", "color.id", "card_color_map.color_id")
    .select([...CARD_COLOR_MAP_TABLE_FIELDS, "color.sequence", "color.mana_symbol"])
    .whereRef("card_color_map.card_id", "=", cardIdReference)
    .$castTo<MtgCardColorDto>());
}

export function $cardFaces(cardIdReference: Expression<string>) {
  const eb = expressionBuilder<DatabaseSchema, never>();
  return helpers.jsonArrayFrom<MtgCardfaceDto>(eb
    .selectFrom("cardface")
    .select((eb) => [
      ...CARDFACE_TABLE_FIELDS,
      helpers.jsonArrayFrom<CardfaceColorDto>(
        eb.selectFrom("cardface_color_map")
          .select(CARDFACE_COLOR_MAP_TABLE_FIELDS)
          .whereRef("cardface_color_map.card_id", "=", "cardface.card_id")
          .whereRef("cardface_color_map.sequence", "=", "cardface.sequence")
          .$castTo<CardfaceColorDto>()
      ).as("cardfaceColors"),
      helpers.jsonObjectFrom<OracleDto>(
        eb.selectFrom("oracle")
          .select(ORACLE_TABLE_FIELDS)
          .whereRef("oracle.oracle_id", "=", "cardface.oracle_id")
          .$castTo<OracleDto>()
      ).as("oracle")
    ])
    .whereRef("cardface.card_id", "=", cardIdReference)
    .$castTo<MtgCardfaceDto>());
}

export function $cardLanguages(cardSetIdRef: Expression<string>, cardCollectorNumberRef: Expression<string>) {
  const eb = expressionBuilder<DatabaseSchema, never>();
  return helpers.jsonArrayFrom<MtgCardLanguageDto>(eb
    .selectFrom("card as c2")
    .select(["c2.lang", "c2.id"])
    .whereRef("c2.set_id", "=", cardSetIdRef)
    .whereRef("c2.collector_number", "=", cardCollectorNumberRef)
    .innerJoin("language", "language.id", "c2.lang")
    .orderBy("language.sequence")
    .$castTo<MtgCardLanguageDto>()
  );
}

export function $oracle(oracleIdReference: Expression<string>) {
  const eb = expressionBuilder<DatabaseSchema, never>();
  return helpers.jsonArrayFrom<OracleDto>(eb
    .selectFrom("oracle")
    .select(ORACLE_TABLE_FIELDS)
    .whereRef("oracle.oracle_id", "=", oracleIdReference)
    .$castTo<OracleDto>()
  );
}
