import { sql } from "kysely";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { ImageSize } from "../../../../../common/enums";
import { DatabaseSchema } from "../../../../database/schema";
import { CardfaceLocalizationImageAdapterParameter, ICardfaceLocalizationImageAdapter } from "../interface";
import { ScryfallCard } from "../../types";

export class CardfaceLocalizationImageAdapter implements ICardfaceLocalizationImageAdapter {
  toInsert(scryfall: CardfaceLocalizationImageAdapterParameter): InsertExpression<DatabaseSchema, "cardface_localization_image"> {
    const result = new Array<InsertExpression<DatabaseSchema, "cardface_localization_image">>();
    Object.keys(scryfall.scryfallCard.image_uris).forEach((key: string) =>
      result.push({
        cardface_localization_id: scryfall.cardfaceLocalizationId,
        image_type: key as ImageSize,
        uri: scryfall.scryfallCard.image_uris[key as keyof Record<ImageSize, string>] as string
      })
    );
    return result;
  }

  toUpdate(scryfall: CardfaceLocalizationImageAdapterParameter): UpdateObjectExpression<DatabaseSchema, "cardface_localization_image"> {
    throw new Error("Method not implemented.");
  }

}
