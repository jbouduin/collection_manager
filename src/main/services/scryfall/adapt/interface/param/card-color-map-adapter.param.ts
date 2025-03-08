import { MtgColor, MtgColorType } from "../../../../../../common/types";


export type CardColorMapAdapterParameter = {
  cardId: string;
  colorType: MtgColorType;
  colors: Array<MtgColor>;
};
