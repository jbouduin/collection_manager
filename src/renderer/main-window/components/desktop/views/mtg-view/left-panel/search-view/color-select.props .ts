import { Props } from "@blueprintjs/core";
import { IColorDto } from "../../../../../../../../common/dto";
import { MtgColor, MtgColorType } from "../../../../../../../../common/types";


export interface ColorSelectProps extends Props {
  colors: Array<IColorDto>;
  colorType: MtgColorType;
  label: string;
  selectedColors: Array<string>;

  onOptionAdded: (color: MtgColor) => void;
  onOptionRemoved: (color: MtgColor) => void;
  onClearOptions: () => void;
}
