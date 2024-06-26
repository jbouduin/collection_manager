import { H5, Section, SectionCard, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";

import { DtoCard, DtoCardLanguage } from "../../../../../common/dto";
import { CardQueryOptions, QueryParam } from "../../../../../common/ipc-params";
import { CardViewmodel } from "../../../viewmodels";
import { CardSymbolProvider } from "../card-symbol-provider/card-symbol-provider";
import { LanguageButtonBar } from "../language-button-bar/language-button-bar";
import { CardfaceView } from "./card-face-view/card-face-view";
import { CardHeaderView } from "./card-header-view/card-header-view";
import { CardImageView } from "./card-image-view/card-image-viewr";
import { CardRulingsView } from "./card-rulings-view/card-rulings-view";
import { CardViewState } from "./card-view-state";
import { CardViewProps } from "./card-view.props";
import { LegalitiesView } from "./legalities-view/legalities-view";


export function CardView(props: CardViewProps) {
  console.log("in cardview function");

  //#region State -------------------------------------------------------------
  const [cardViewState, setCardViewState] = React.useState<CardViewState>({ card: null, cardfaceSequence: 0 });
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      if (props.cardId) {
        loadCard(props.cardId);
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
        <div style={{"minWidth": "410px"}}>
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
        compact={true}
        collapsible={true}
        title={<CardHeaderView card={cardViewState.card} />}
        rightElement={<CardSymbolProvider cardSymbols={cardViewState.card.cardManacost} className="mana-cost-image-in-title" />}
      >
        {
          cardViewState.card.isMultipleLanguage &&
          <SectionCard padded={false}>
            <LanguageButtonBar
              cardLanguages={cardViewState.card.otherCardLanguages}
              currentLanguage={cardViewState.card.cardLanguage}
              onButtonClick={(language: DtoCardLanguage) => loadCard(language.id)}
            />
          </SectionCard>
        }
        <CardImageView
          card={cardViewState.card}
        />
      </Section>
    );
  }

  function renderFacesSection(): Array<React.JSX.Element> {
    const result = new Array<React.JSX.Element>();
    result.push((
      <CardfaceView key="face0"
        cardface={cardViewState.card.getCardface(0)}
        oracle={cardViewState.card.getOracle(0) ?? cardViewState.card.getCardface(0).oracle}
      />
    ));
    const otherFace = cardViewState.card.getCardface(1);
    if (otherFace) {
      result.push((
        <CardfaceView key="face1"
          cardface={otherFace}
          oracle={cardViewState.card.getOracle(1) ?? cardViewState.card.getCardface(1).oracle}
        />
      ));
    }
    return result;
  }

  function renderMoreSection(): React.JSX.Element {
    return (
      <Section
        compact={true}
        collapsible={true}
        title={<div><H5 style={{ "marginBottom": "0px" }}>More</H5></div>}
      >
        <SectionCard className="card-view-section-card" >
          <Tabs animate={true} id="card-detail-tabs" defaultSelectedTabId="Rulings" renderActiveTabPanelOnly={true}>
            <Tab
              id="Rulings"
              title="Rulings"
              panel={<CardRulingsView card={cardViewState.card} />}
            />
            <Tab
              id="Legality"
              title="Legality"
              panel={<LegalitiesView oracleId={cardViewState.card.oracleId} />}
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
      const cardQueryParam: QueryParam<CardQueryOptions> = {
        type: "Card",
        options: {
          cardId: cardId,
          setIds: null
        }
      };
      window.ipc
        .query(cardQueryParam)
        .then((cardResult: Array<DtoCard>) =>
          setCardViewState(
            {
              card: new CardViewmodel(cardResult[0]),
              cardfaceSequence: 0
            })
        );
    }
    else {
      setCardViewState(undefined);
    }
  }
  //#endregion
}
