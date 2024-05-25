import { Section, SectionCard, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";


import { DtoCard, DtoCardLanguage } from "../../../../../common/dto";
import { CardQueryOptions, QueryParam } from "../../../../../common/ipc-params";
import { CardViewmodel } from "../../../viewmodels";
import { LanguageButtonBar } from "../language-button-bar/language-button-bar";
import { CardDetailPanelProps } from "./card-detail-panel.props";
import { CardHeader } from "./card-header/card-header";
import { CardImage } from "./card-image/card-image";
import { CardRulings } from "./card-rulings/card-rulings";
import { LocalizedCardHeader } from "./localized-card-header/localized-card-header";
import { OraclePanel } from "./oracle-panel/oracle-panel";
import { PrintedPanel } from "./printed-panel/printed-panel";

export function CardDetailPanel(props: CardDetailPanelProps) {

  // FEATURE: cards with multiple faces:
  // for reversible cards:
  //  have two CardImage components and a turn over button
  //  display the details of the visible face
  // for non-reversible cards:
  //  use collapsible panels which display details of a face

  //#region State -------------------------------------------------------------
  const [card, setCard] = React.useState<CardViewmodel>(undefined);
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
  return (card && props.cardSet ?
    <Section className={props.className}>
      <CardHeader className={props.className} card={card} cardSetSvg={props.cardSet?.cardSetSvg} symbolSvgs={props.cachedSvg} />
      {card.isMultipleLanguage &&
        <LanguageButtonBar className={props.className} cardLanguages={card.cardLanuages} languages={props.languages} currentLanguage={card.language} onButtonClick={onButtonClick} />
      }
      <CardImage className={props.className} card={card} />
      {card.isLocalizedCard &&
          <LocalizedCardHeader card={card} className={props.className}/>
      }
      <SectionCard padded={true} className={props.className}>
        <Tabs animate={true} className={props.className} id="card-detail-tabs" defaultSelectedTabId="Oracle" renderActiveTabPanelOnly={true}>
          <Tab id="Oracle" title="Oracle" panel={<OraclePanel className={props.className} card={card} />} />
          <Tab id="Printed" title="Printed" panel={<PrintedPanel className={props.className} card={card} />} />
        </Tabs>
      </SectionCard>
      <SectionCard padded={true} className={props.className}>
        <Tabs animate={true} className={props.className} id="card-detail-tabs" defaultSelectedTabId="Rulings" renderActiveTabPanelOnly={true}>
          <Tab id="Rulings" title="Rulings" panel={<CardRulings card={card} />} />
          <Tab id="other_info" title="Other info" />
        </Tabs>
      </SectionCard>
    </Section>
    : <Section className={props.className} ></Section>
  );
  //#endregion

  //#region helper functions --------------------------------------------------
  async function loadCard(cardId: string): Promise<void> {
    if (cardId) {
      const cardQueryParam: QueryParam<CardQueryOptions> = {
        type: "Card",
        options: {
          cardId: cardId,
          setIds: null
        }
      };
      window.ipc.query(cardQueryParam)
        .then((cardResult: Array<DtoCard>) => {
          setCard(new CardViewmodel(cardResult[0]));
        });
    }
    else {
      setCard(undefined);
    }
  }
  //#endregion
}
