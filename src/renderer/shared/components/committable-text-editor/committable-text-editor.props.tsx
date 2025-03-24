import { Props } from "@blueprintjs/core";

export interface CommittableTextEditorProps extends Props {
  //#region Properties --------------------------------------------------------
  isNullable: boolean;
  label?: string;
  maxLength?: number;
  minlength?: number;
  multiple: boolean;
  orgValue: string;
  placeholder: string;
  //#endregion

  //#region Event handlers ----------------------------------------------------
  onCommit: (value: string) => Promise<void>;
  //#endregion
}
