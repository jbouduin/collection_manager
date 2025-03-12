import { Expression, expressionBuilder } from "kysely";
import * as helpers from "kysely/helpers/sqlite";
import { ICardfaceColorDto, IMtgCardColorDto, IMtgCardfaceDto, IMtgCardLanguageDto, IOracleDto } from "../../../../../common/dto";
import { CARD_COLOR_MAP_TABLE_FIELDS, CARDFACE_COLOR_MAP_TABLE_FIELDS, CARDFACE_TABLE_FIELDS, DatabaseSchema, ORACLE_TABLE_FIELDS } from "../../../schema";


/* eslint-disable @stylistic/function-paren-newline */
export function $cardColors(cardIdReference: Expression<string>) {
  const eb = expressionBuilder<DatabaseSchema, never>();
  return helpers.jsonArrayFrom<IMtgCardColorDto>(eb
    .selectFrom("card_color_map")
    .innerJoin("color", "color.id", "card_color_map.color_id")
    .select([...CARD_COLOR_MAP_TABLE_FIELDS, "color.sequence", "color.mana_symbol"])
    .whereRef("card_color_map.card_id", "=", cardIdReference)
    .$castTo<IMtgCardColorDto>());
}

export function $cardFaces(cardIdReference: Expression<string>) {
  const eb = expressionBuilder<DatabaseSchema, never>();
  return helpers.jsonArrayFrom<IMtgCardfaceDto>(eb
    .selectFrom("cardface")
    .select((eb) => [
      ...CARDFACE_TABLE_FIELDS,
      helpers.jsonArrayFrom<ICardfaceColorDto>(
        eb.selectFrom("cardface_color_map")
          .select(CARDFACE_COLOR_MAP_TABLE_FIELDS)
          .whereRef("cardface_color_map.card_id", "=", "cardface.card_id")
          .whereRef("cardface_color_map.sequence", "=", "cardface.sequence")
          .$castTo<ICardfaceColorDto>()
      ).as("cardfaceColors"),
      helpers.jsonObjectFrom<IOracleDto>(
        eb.selectFrom("oracle")
          .select(ORACLE_TABLE_FIELDS)
          .whereRef("oracle.oracle_id", "=", "cardface.oracle_id")
          .$castTo<IOracleDto>()
      ).as("oracle")
    ])
    .whereRef("cardface.card_id", "=", cardIdReference)
    .$castTo<IMtgCardfaceDto>());
}

export function $cardLanguages(cardSetIdRef: Expression<string>, cardCollectorNumberRef: Expression<string>) {
  const eb = expressionBuilder<DatabaseSchema, never>();
  return helpers.jsonArrayFrom<IMtgCardLanguageDto>(eb
    .selectFrom("card as c2")
    .select(["c2.lang", "c2.id"])
    .whereRef("c2.set_id", "=", cardSetIdRef)
    .whereRef("c2.collector_number", "=", cardCollectorNumberRef)
    .innerJoin("language", "language.id", "c2.lang")
    .orderBy("language.sequence")
    .$castTo<IMtgCardLanguageDto>()
  );
}

export function $oracle(oracleIdReference: Expression<string>) {
  const eb = expressionBuilder<DatabaseSchema, never>();
  return helpers.jsonArrayFrom<IOracleDto>(eb
    .selectFrom("oracle")
    .select(ORACLE_TABLE_FIELDS)
    .whereRef("oracle.oracle_id", "=", oracleIdReference)
    .$castTo<IOracleDto>()
  );
}
