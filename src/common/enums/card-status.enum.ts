enum ECardStatus {
  missing,
  placeholder,
  lowres,
  highres_scan,
}

export type CardStatus = keyof typeof ECardStatus;
