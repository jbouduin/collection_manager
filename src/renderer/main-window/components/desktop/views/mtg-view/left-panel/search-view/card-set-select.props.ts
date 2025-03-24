import { Props } from "@blueprintjs/core";
import { IMtgCardSetDto } from "../../../../../../../../common/dto";


export interface CardSetSelectProps extends Props {
  allCardSets: Array<IMtgCardSetDto>;
  onClearOptions: () => void;
  onOptionAdded: (cardSet: IMtgCardSetDto) => void;
  onOptionRemoved: (cardSetId: IMtgCardSetDto) => void;
  selectedCardSets: Array<IMtgCardSetDto>;
}
