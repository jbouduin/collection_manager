import { Section, SectionCard, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";


import { DtoCard, DtoCardLanguage } from "../../../../../common/dto";
import { CardLayout } from "../../../../../common/enums";
import { CardQueryOptions, QueryParam } from "../../../../../common/ipc-params";
import { CardViewmodel } from "../../../viewmodels";
import { LanguageButtonBar } from "../language-button-bar/language-button-bar";
import { CardHeaderView } from "./card-header-view/card-header-view";
import { CardImageViewWrapper } from "./card-image-view/card-image-view-wrapper";
import { CardRulingsView } from "./card-rulings-view/card-rulings-view";
import { CardViewState } from "./card-view-state";
import { CardViewProps } from "./card-view.props";
import { LegalitiesView } from "./legalities-view/legalities-view";
import { OracleView } from "./oracle-view/oracle-view";
import { PrintedView } from "./printed-view/printed-view";
import { SubCardHeaderView } from "./sub-card-header-view/sub-card-header-view";

export function CardView(props: CardViewProps) {

  // TODO use collapsible panels when displaying two faces

  //#region State -------------------------------------------------------------
  const [cardViewState, setCardViewState] = React.useState<CardViewState>({ card: null, cardfaceSequence: 0 });
  //#endregion

  //#region Event handlers ----------------------------------------------------
  const onButtonClick = React.useCallback((language: DtoCardLanguage) => {
    loadCard(language.id);
  }, []
  );
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(() => {
    if (props.cardId) {
      loadCard(props.cardId);
    }
  }, [props.cardId]);
  //#endregion

  //#region Main --------------------------------------------------------------
  return (cardViewState.card && props.cardSet ?
    <Section>
      <CardHeaderView
        card={cardViewState.card}
        cardSetSvg={props.cardSet?.cardSetSvg}
      />
      {
        cardViewState.card.isMultipleLanguage &&
        <LanguageButtonBar
          cardLanguages={cardViewState.card.otherCardLanguages}
          currentLanguage={cardViewState.card.cardLanguage}
          onButtonClick={onButtonClick}
        />
      }
      {
        getViewByLayout(cardViewState.card.cardLayout)
      }
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
    : <Section ></Section>
  );
  //#endregion

  //#region Auxiliary functions -----------------------------------------------
  function getViewByLayout(cardLayout: CardLayout) {
    switch (cardLayout) {
      case "augment":
      case "case":
      case "class":
      case "emblem":
      case "host":
      case "leveler":
      case "meld":
      case "mutate":
      case "normal":
      case "planar":
      case "prototype":
      case "saga":
      case "scheme":
      case "token":
      case "vanguard":
        return SingleFaceLayout();
      case "art_series":
      case "adventure":
      case "double_faced_token":
      case "flip":
      case "modal_dfc":
      case "reversible_card":
      case "split":
      case "transform":
        return DoubleFaceLayout();
      case "battle":
        throw new Error("not supported as scryfall does not return result when searching");
      default:
        throw new Error("Card layout not supported");
    }
  }

  function SingleFaceLayout(): React.JSX.Element {
    return (
      <div>
        <CardImageViewWrapper
          card={cardViewState.card}
        />
        {
          cardViewState.card.isLocalizedCard &&
          <SubCardHeaderView
            cardface={cardViewState.card.getCardface(0)}
            showManaCost={false}
          />
        }
        <SectionCard className="card-view-section-card">
          <Tabs animate={true} id="card-detail-tabs" defaultSelectedTabId="Oracle0" renderActiveTabPanelOnly={true}>
            <Tab
              id="Oracle0"
              title="Oracle"
              panel={<OracleView oracle={cardViewState.card.getOracle(0)} />}
            />
            <Tab
              id="Printed0"
              title="Printed"
              panel={<PrintedView cardface={cardViewState.card.getCardface(0)} />}
            />
          </Tabs>
        </SectionCard>
      </div>);
  }

  function DoubleFaceLayout(): React.JSX.Element {
    return (
      <div>
        <CardImageViewWrapper
          card={cardViewState.card}
        />
        <SubCardHeaderView
          cardface={cardViewState.card.getCardface(0)}
          showManaCost={true}
        />
        <SectionCard className="card-view-section-card" >
          <Tabs animate={true} id="card-detail-tabs" defaultSelectedTabId="Oracle0" renderActiveTabPanelOnly={true}>
            <Tab
              id="Oracle0"
              title="Oracle"
              panel={
                <OracleView oracle={cardViewState.card.getOracle(0) ?? cardViewState.card.getCardface(0).oracle} />
              }
            />
            <Tab
              id="Printed0"
              title="Printed"
              panel={
                <PrintedView cardface={cardViewState.card.getCardface(0)} />}
            />
          </Tabs>
        </SectionCard>
        <SubCardHeaderView
          cardface={cardViewState.card.getCardface(1)}
          showManaCost={true}
        />
        <SectionCard className="card-view-section-card" >
          <Tabs animate={true} id="card-detail-tabs" defaultSelectedTabId="Oracle1" renderActiveTabPanelOnly={true}>
            <Tab
              id="Oracle1"
              title="Oracle"
              panel={
                <OracleView oracle={cardViewState.card.getOracle(1) ?? cardViewState.card.getCardface(1).oracle} />
              }
            />
            <Tab
              id="Printed1"
              title="Printed"
              panel={
                <PrintedView cardface={cardViewState.card.getCardface(1)} />}
            />
          </Tabs>
        </SectionCard>
      </div>
    );
  }

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
