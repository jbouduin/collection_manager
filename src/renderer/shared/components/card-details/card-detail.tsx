import { H5, Section, SectionCard, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";
import { IMtgCardDetailDto, IMtgCardLanguageDto } from "../../../../common/dto";
import { IIpcProxyService, IpcProxyServiceContext } from "../../context";
import { MtgCardDetailViewmodel } from "../../viewmodels";
import { CardSymbolRenderer } from "../card-symbol-renderer";
import { CardDetailProps } from "./card-detail.props";
import { CardDetailState } from "./card-detail.state";
import { CardfaceView } from "./card-face-view/card-face-view";
import { CardHeaderView } from "./card-header-view";
import { CardImageView } from "./card-image-view";
import { CardOwnerShipView } from "./card-ownership-view";
import { CardRulingsView } from "./card-rulings-view";
import { LanguageButtonBar } from "./language-button-bar";
import { LegalitiesView } from "./legalities-view";
import { CardAllPrints } from "./card-all-prints/card-all-prints";


export function CardDetail(props: CardDetailProps) {
  //#region State -------------------------------------------------------------
  const [cardViewState, setCardViewState] = React.useState<CardDetailState>({ card: null, cardfaceSequence: 0 });
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const ipcProxyService = React.useContext<IIpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      if (props.cardId) {
        void loadCard(props.cardId);
      }
    },
    [props.cardId]
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <div className="card-view-wrapper">
      {
        cardViewState.card &&
        <div style={{ minWidth: "410px" }}>
          {renderTopSection()}
          {renderFacesSection()}
          {renderMoreSection()}
        </div>
      }
    </div>
  );

  //#endregion

  //#region Auxiliary rendering functions -------------------------------------
  function renderTopSection(): React.JSX.Element {
    return (
      <Section
        collapsible={true}
        compact={true}
        rightElement={<CardSymbolRenderer cardSymbols={cardViewState.card.cardManacost} className="mana-cost-image-in-title" />}
        title={<CardHeaderView card={cardViewState.card} />}
      >
        {
          props.showOtherLanguages && cardViewState.card.isMultipleLanguage &&
          <SectionCard padded={false}>
            <LanguageButtonBar
              cardLanguages={cardViewState.card.otherCardLanguages}
              currentLanguage={cardViewState.card.cardLanguage}
              onButtonClick={(language: IMtgCardLanguageDto) => void loadCard(language.id)}
            />
          </SectionCard>
        }
        <CardImageView
          cardId={cardViewState.card?.cardId}
          cardLayout={cardViewState.card?.cardLayout}
        />
      </Section>
    );
  }

  function renderFacesSection(): Array<React.JSX.Element> {
    const result = new Array<React.JSX.Element>();
    result.push((
      <CardfaceView
        cardface={cardViewState.card.getCardface(0)}
        key="face0"
        oracle={cardViewState.card.getOracle(0) ?? cardViewState.card.getCardface(0).oracle}
      />
    ));
    const otherFace = cardViewState.card.getCardface(1);
    if (otherFace) {
      result.push((
        <CardfaceView
          cardface={otherFace}
          key="face1"
          oracle={cardViewState.card.getOracle(1) ?? cardViewState.card.getCardface(1).oracle}
        />
      ));
    }
    return result;
  }

  function renderMoreSection(): React.JSX.Element {
    return (
      <Section
        collapsible={true}
        compact={true}
        title={<div><H5 style={{ marginBottom: "0px" }}>More</H5></div>}
      >
        <SectionCard className="card-view-section-card" >
          <Tabs
            animate={true}
            defaultSelectedTabId="Rulings"
            id="card-detail-tabs"
            renderActiveTabPanelOnly={true}
          >
            <Tab
              id="Rulings"
              key="rulings"
              panel={<CardRulingsView oracleId={cardViewState.card.oracleId} />}
              title="Rulings"
            />
            <Tab
              id="Legality"
              key="legality"
              panel={<LegalitiesView oracleId={cardViewState.card.oracleId} />}
              title="Legality"
            />
            <Tab
              id="Owned"
              key="owned"
              panel={<CardOwnerShipView cardId={cardViewState.card.cardId} className={props.className} collectionId={props.collectionId} />}
              title="Ownership"
            />
            <Tab
              id="All prints"
              key="all-prints"
              panel={<CardAllPrints cardId={cardViewState.card.cardId} oracleId={cardViewState.card.oracleId} />}
              title="All prints"
            />
          </Tabs>
        </SectionCard>
      </Section>
    );
  }
  //#endregion

  //#region Other Auxiliary methods -------------------------------------------
  async function loadCard(cardId: string): Promise<void> {
    if (cardId) {
      await ipcProxyService.getData<IMtgCardDetailDto>(`/card/${cardId}`)
        .then(
          (cardResult: IMtgCardDetailDto) => setCardViewState({ card: new MtgCardDetailViewmodel(cardResult), cardfaceSequence: 0 }),
          (_r: Error) => setCardViewState(null)
        );
    } else {
      setCardViewState(undefined);
    }
  }
  //#endregion
}
