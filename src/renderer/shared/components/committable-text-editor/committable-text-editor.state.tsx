import { CommittableTextEditorViewmodel } from "./committable-text-editor.viewmodel";

export interface CommittableTextEditorState {
  readOnly: boolean;
  value: CommittableTextEditorViewmodel;
}
