import { MtgColor, MtgColorType } from "../../../../../../common/types";


export type CardfaceColorMapAdapterParameter = {
  cardId: string;
  sequence: number;
  colorType: MtgColorType;
  colors: Array<MtgColor>;
};
