import { Props } from "@blueprintjs/core";
import { ColorDto } from "../../../../../../../../common/dto";
import { MTGColor, MTGColorType } from "../../../../../../../../common/types";


export interface ColorSelectProps extends Props {
  colors: Array<ColorDto>;
  colorType: MTGColorType;
  label: string;
  selectedColors: Array<string>;

  onOptionAdded: (color: MTGColor) => void;
  onOptionRemoved: (color: MTGColor) => void;
  onClearOptions: () => void;
}
