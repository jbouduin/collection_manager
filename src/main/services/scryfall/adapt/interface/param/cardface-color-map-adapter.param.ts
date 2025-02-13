import { MTGColor, MTGColorType } from "../../../../../../common/enums";

export type CardfaceColorMapAdapterParameter = {
  cardId: string;
  sequence: number;
  colorType: MTGColorType;
  colors: Array<MTGColor>;
};
