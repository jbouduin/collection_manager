import { MTGColor, MTGColorType } from "../../../../../../common/enums";

export type CardfaceColorMapAdapterParameter = {
  cardfaceId: string,
  colorType: MTGColorType,
  colors: Array<MTGColor>
};
