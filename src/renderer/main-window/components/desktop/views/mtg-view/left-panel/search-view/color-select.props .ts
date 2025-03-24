import { Props } from "@blueprintjs/core";
import { IColorDto } from "../../../../../../../../common/dto";
import { MtgColorType } from "../../../../../../../../common/types";


export interface ColorSelectProps extends Props {
  allColors: Array<IColorDto>;
  colorType: MtgColorType;
  label: string;
  onClearOptions: () => void;
  onOptionAdded: (color: IColorDto) => void;
  onOptionRemoved: (color: IColorDto) => void;
  selectedColors: Array<IColorDto>;
}
