import { MTGColor, MTGColorType } from "../../../../../../common/enums";

export type CardColorMapAdapterParameter = {
  cardId: string;
  colorType: MTGColorType;
  colors: Array<MTGColor>;
};
