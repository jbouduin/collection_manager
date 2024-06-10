enum EChangedImageStatusAction {
  delete,
  replace
}

export type ChangedImageStatusAction = keyof typeof EChangedImageStatusAction;
