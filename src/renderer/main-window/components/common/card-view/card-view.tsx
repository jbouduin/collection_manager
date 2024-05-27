import { Section, SectionCard, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";


import { DtoCard, DtoCardLanguage } from "../../../../../common/dto";
import { CardLayout } from "../../../../../common/enums";
import { CardQueryOptions, QueryParam } from "../../../../../common/ipc-params";
import { CardViewmodel } from "../../../viewmodels";
import { LanguageButtonBar } from "../language-button-bar/language-button-bar";
import { CardHeaderView } from "./card-header-view/card-header-view";
import { CardImageView } from "./card-image-view/card-image-view";
import { CardRulingsView } from "./card-rulings-view/card-rulings-view";
import { CardViewState } from "./card-view-state";
import { CardViewProps } from "./card-view.props";
import { LegalitiesView } from "./legalities-view/legalities-view";
import { OracleView } from "./oracle-view/oracle-view";
import { PrintedView } from "./printed-view/printed-view";
import { SubCardHeaderView } from "./sub-card-header-view/sub-card-header-view";

export function CardView(props: CardViewProps) {

  // FEATURE: cards with multiple faces:
  // for reversible cards:
  //  have two CardImage components and a turn over button
  //  display the details of the visible face
  // for non-reversible cards:
  //  use collapsible panels which display details of a face

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
    if (props.selectedCard) {
      loadCard(props.selectedCard.cardId);
    }
  }, [props.selectedCard]);
  //#endregion

  //#region Main --------------------------------------------------------------
  return (cardViewState.card && props.cardSet ?
    <Section className={props.className}>
      <CardHeaderView className={props.className} card={cardViewState.card} cardSetSvg={props.cardSet?.cardSetSvg} symbolSvgs={props.symbolSvgs} />
      {
        cardViewState.card.isMultipleLanguage &&
        <LanguageButtonBar
          className={props.className}
          cardLanguages={cardViewState.card.otherCardLanguages}
          languages={props.languages}
          currentLanguage={cardViewState.card.cardLanguage}
          onButtonClick={onButtonClick} />
      }
      {
        getViewByLayout(cardViewState.card.cardLayout)
      }
      <SectionCard padded={true} className={props.className}>
        <Tabs animate={true} className={props.className} id="card-detail-tabs" defaultSelectedTabId="Rulings" renderActiveTabPanelOnly={true}>
          <Tab id="Rulings" title="Rulings" panel={<CardRulingsView card={cardViewState.card} />} />
          <Tab id="Legality" title="Legality" panel={<LegalitiesView oracleId={cardViewState.card.oracleId} />} />
        </Tabs>
      </SectionCard>
    </Section>
    : <Section className={props.className} ></Section>
  );
  //#endregion

  //#region Auxiliary functions -----------------------------------------------
  function getViewByLayout(cardLayout: CardLayout) {
    switch (cardLayout) {
      case "normal":
        return SingleSidedSingleFaceLayout();
      case "split":
      case "flip":
        return SingleSidedDoubleFaceLayout();
    }
  }

  function SingleSidedSingleFaceLayout(): React.JSX.Element {
    return (
      <div>
        <CardImageView
          className={props.className}
          cardface={cardViewState.card.getCardface(cardViewState.cardfaceSequence)}
          layout={cardViewState.card.cardLayout}
        />
        {
          cardViewState.card.isLocalizedCard &&
          <SubCardHeaderView
            cardface={cardViewState.card.getCardface(0)}
            symbolSvgs={props.symbolSvgs}
            showManaCost={false}
            className={props.className}
          />
        }
        <SectionCard padded={true} className={props.className}>
          <Tabs animate={true} className={props.className} id="card-detail-tabs" defaultSelectedTabId="Oracle0" renderActiveTabPanelOnly={true}>
            <Tab
              id="Oracle0"
              title="Oracle"
              panel={<OracleView className={props.className} oracle={cardViewState.card.getOracle(0)} symbolSvgs={props.symbolSvgs} />}
            />
            <Tab
              id="Printed0"
              title="Printed"
              panel={<PrintedView className={props.className} cardface={cardViewState.card.getCardface(0)} symbolSvgs={props.symbolSvgs} />}
            />
          </Tabs>
        </SectionCard>
      </div>);
  }

  function SingleSidedDoubleFaceLayout(): React.JSX.Element {
    return (
      <div>
        <CardImageView
          className={props.className}
          cardface={cardViewState.card.getCardface(cardViewState.cardfaceSequence)}
          layout={cardViewState.card.cardLayout}
        />
        <SubCardHeaderView
          cardface={cardViewState.card.getCardface(0)}
          symbolSvgs={props.symbolSvgs}
          showManaCost={true}
          className={props.className}
        />
        <SectionCard padded={true} className={props.className}>
          <Tabs animate={true} className={props.className} id="card-detail-tabs" defaultSelectedTabId="Oracle0" renderActiveTabPanelOnly={true}>
            <Tab
              id="Oracle0"
              title="Oracle"
              panel={<OracleView className={props.className} oracle={cardViewState.card.getOracle(0)} symbolSvgs={props.symbolSvgs} />}
            />
            <Tab
              id="Printed0"
              title="Printed"
              panel={<PrintedView className={props.className} cardface={cardViewState.card.getCardface(0)} symbolSvgs={props.symbolSvgs} />}
            />
          </Tabs>
        </SectionCard>
        <SubCardHeaderView
          cardface={cardViewState.card.getCardface(1)}
          symbolSvgs={props.symbolSvgs}
          showManaCost={true}
          className={props.className}
        />
        <SectionCard padded={true} className={props.className}>
          <Tabs animate={true} className={props.className} id="card-detail-tabs" defaultSelectedTabId="Oracle1" renderActiveTabPanelOnly={true}>
            <Tab
              id="Oracle1"
              title="Oracle"
              panel={<OracleView className={props.className} oracle={cardViewState.card.getOracle(1)} symbolSvgs={props.symbolSvgs} />}
            />
            <Tab
              id="Printed1"
              title="Printed"
              panel={<PrintedView className={props.className} cardface={cardViewState.card.getCardface(1)} symbolSvgs={props.symbolSvgs} />}
            />
          </Tabs>
        </SectionCard>
      </div>);
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
