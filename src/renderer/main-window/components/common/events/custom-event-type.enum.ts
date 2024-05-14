enum ECustomEventType {
  CardSelectionChanged,
  CardSetSelectionChanged
}

export type CustomEventType = keyof typeof ECustomEventType;
