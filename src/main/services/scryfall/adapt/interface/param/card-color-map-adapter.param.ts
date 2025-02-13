import { MTGColor, MTGColorType } from "../../../../../../common/types";


export type CardColorMapAdapterParameter = {
  cardId: string;
  colorType: MTGColorType;
  colors: Array<MTGColor>;
};
