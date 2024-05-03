enum ELanguage {
    EN,
    ES,
    FR,
    DE,
    IT,
    PT,
    JA,
    KO,
    RU,
    ZHS,
    ZHT,
    HE,
    LA,
    GRC,
    AR,
    SA,
    PH
}

export type Language = keyof typeof ELanguage;
