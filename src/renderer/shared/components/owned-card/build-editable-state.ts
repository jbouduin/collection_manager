import { ICardConditionDto, IOwnedCardQuantityDto } from "../../../../common/dto";
import { OwnedCardQuantityViewmodel } from "../../viewmodels";


export function buildEditableState(conditions: Array<ICardConditionDto>, cardId: string, collectionId: number, quantities: Array<IOwnedCardQuantityDto>): Array<OwnedCardQuantityViewmodel> {
  const result: Array<OwnedCardQuantityViewmodel> = quantities.map((qty: IOwnedCardQuantityDto) => new OwnedCardQuantityViewmodel(qty));
  conditions.forEach((condition: ICardConditionDto) => {
    [true, false].forEach((foil: boolean) => {
      const existing = quantities.find((qty: IOwnedCardQuantityDto) => qty.condition_id == condition.id && qty.is_foil == foil);
      if (!existing) {
        const nonExisting: IOwnedCardQuantityDto = {
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
