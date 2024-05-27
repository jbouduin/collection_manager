import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";

import { ImageSize } from "../../../../../common/enums";
import { DatabaseSchema } from "../../../../database/schema";
import { CardfaceImageAdapterParameter } from "../interface/param";
import { ScryfallImageUris } from "../../types";
import { ICardfaceImageAdapter } from "../interface";

export class CardfaceImageAdapter implements ICardfaceImageAdapter {
  public toInsert(scryfall: CardfaceImageAdapterParameter): InsertExpression<DatabaseSchema, "cardface_image"> {
    const result = new Array<InsertExpression<DatabaseSchema, "cardface_image">>();
    scryfall.images.forEach((image: ScryfallImageUris, idx: number) => {
      Object.keys(image).forEach((imagesize: string) =>
        result.push({
          card_id: scryfall.cardId,
          sequence: idx,
          image_type: imagesize as ImageSize,
          uri: image[imagesize as keyof ScryfallImageUris]
        })
      );
    });
    return result;
  }

  public toUpdate(_scryfall: CardfaceImageAdapterParameter): UpdateObjectExpression<DatabaseSchema, "cardface_image"> {
    throw new Error("Method not implemented.");
  }

}
