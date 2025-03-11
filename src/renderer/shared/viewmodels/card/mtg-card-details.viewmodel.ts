import { MtgCardDetailDto, MtgCardfaceDto, MtgCardLanguageDto, OracleDto } from "../../../../common/dto";
import { CardLayout, MtgLanguage } from "../../../../common/types";
import { OracleViewmodel } from "../oracle";
import { BaseMtgCardViewmodel } from "./base-mtg-card.viewmodel";
import { MtgCardFaceViewmodel } from "./mtg-card-face.viewmodel";


export class MtgCardDetailViewmodel extends BaseMtgCardViewmodel<MtgCardDetailDto> {
  private readonly cardFaces: Map<number, MtgCardFaceViewmodel>;
  private readonly oracles: Map<number, OracleViewmodel>;

  //#region Detail specific getters -------------------------------------------
  public get cardLanguage(): MtgLanguage {
    return this._dtoCard.lang;
  }

  public get cardLayout(): CardLayout {
    return this._dtoCard.layout;
  }

  public get isMultipleLanguage(): boolean {
    return this._dtoCard.languages.length > 1;
  }

  public get oracleId(): string {
    return this._dtoCard.oracle_id;
  }

  public get otherCardLanguages(): Array<MtgCardLanguageDto> {
    return this._dtoCard.languages;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(dtoCard: MtgCardDetailDto) {
    super(dtoCard);
    this.cardFaces = new Map<number, MtgCardFaceViewmodel>();
    this._dtoCard.cardfaces.sort((a: MtgCardfaceDto, b: MtgCardfaceDto) => a.sequence - b.sequence);
    this._dtoCard.cardfaces.forEach((cardface: MtgCardfaceDto) => this.cardFaces.set(cardface.sequence, new MtgCardFaceViewmodel(cardface)));
    this.oracles = new Map<number, OracleViewmodel>();
    this._dtoCard.oracle.sort((a: OracleDto, b: OracleDto) => a.face_sequence - b.face_sequence);
    this._dtoCard.oracle.forEach((oracle: OracleDto) => this.oracles.set(oracle.face_sequence, new OracleViewmodel(oracle)));
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public getCardface(sequence: number): MtgCardFaceViewmodel {
    return this.cardFaces.get(sequence);
  }

  public getOracle(sequence: number): OracleViewmodel {
    return this.oracles.get(sequence);
  }
  //#endregion
}
