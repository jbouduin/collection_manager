import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { ImageSize } from "../../../../../common/enums";
import { DatabaseSchema } from "../../../../database/schema";
import { CardfaceImageAdapterParameter } from "../interface/param";
import { ScryfallImageUris } from "../../types";
import { ICardfaceImageAdapter } from "../interface";

export class CardfaceImageAdapter implements ICardfaceImageAdapter {
  toInsert(scryfall: CardfaceImageAdapterParameter): InsertExpression<DatabaseSchema, "cardface_image"> {
    const result = new Array<InsertExpression<DatabaseSchema, "cardface_image">>();
    Object.keys(scryfall.scryfallCard.image_uris).forEach((key: string) =>
      result.push({
        cardface_id: scryfall.cardfaceId,
        image_type: key as ImageSize,
        uri: scryfall.scryfallCard.image_uris[key as keyof ScryfallImageUris]
      })
    );
    return result;
  }

  toUpdate(_scryfall: CardfaceImageAdapterParameter): UpdateObjectExpression<DatabaseSchema, "cardface_image"> {
    throw new Error("Method not implemented.");
  }

}
