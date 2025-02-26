import { OwnedCardQuantityDto } from "../../../../../common/dto";
import { CardConditionViewmodel, OwnedCardQuantityViewmodel } from "../../../viewmodels";

export function buildEditableState(conditions: Array<CardConditionViewmodel>, cardId: string, collectionId: number, quantities: Array<OwnedCardQuantityDto>): Array<OwnedCardQuantityViewmodel> {
  const result: Array<OwnedCardQuantityViewmodel> = quantities.map((qty: OwnedCardQuantityDto) => new OwnedCardQuantityViewmodel(qty));
  conditions.forEach((condition: CardConditionViewmodel) => {
    [true, false].forEach((foil: boolean) => {
      const existing = quantities.find((qty: OwnedCardQuantityDto) => qty.condition_id == condition.id && qty.is_foil == foil);
      if (!existing) {
        const nonExisting: OwnedCardQuantityDto = {
          collectionMaps: [
            {
              created_at: undefined,
              modified_at: undefined,
              owned_card_id: 0,
              collection_id: collectionId,
              quantity: 0
            }
          ],
          id: 0,
          created_at: undefined,
          modified_at: undefined,
          card_id: cardId,
          condition_id: condition.id,
          is_foil: foil,
          comments: ""
        };
        result.push(new OwnedCardQuantityViewmodel(nonExisting));
      }
    });
  });
  return result;
}
