import { MTGColor, MTGColorType } from "../../../../../../common/types";


export type CardfaceColorMapAdapterParameter = {
  cardId: string;
  sequence: number;
  colorType: MTGColorType;
  colors: Array<MTGColor>;
};
