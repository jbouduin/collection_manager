import { Cell, CellRenderer, Column, ColumnProps } from "@blueprintjs/table";
import * as React from "react";
import { DtoCard, DtoLanguage } from "../../../../../../../common/dto";
import { CardQueryOptions, QueryParam } from "../../../../../../../common/ipc-params";
import { MTGLanguage } from "../../../../../../../common/types";
import { BaseCardsTableView } from "../../../../../components/common/base-cards-table-view/base-cards-table-view";
import { cardSetNameRenderer, symbolRenderer, textCellRenderer } from "../../../../../components/common/base-cards-table-view/cell-renderers";
import { LanguagesContext } from "../../../../../components/context";
import { CardSetViewmodel, CardViewmodel } from "../../../../../viewmodels";
import { CenterPanelProps } from "./center-panel.props";


export function CenterPanel(props: CenterPanelProps) {
  //#region State -------------------------------------------------------------
  const [cards, setCards] = React.useState(new Array<CardViewmodel>());
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      if (props.selectedSets) {
        const cardQueryParam: QueryParam<CardQueryOptions> = {
          type: "Card",
          options: {
            cardId: null,
            setIds: props.selectedSets.map((set: CardSetViewmodel) => set.id)
          }
        };
        void window.ipc.query(cardQueryParam)
          .then((cardResult: Array<DtoCard>) => {
            setCards(cardResult
              .map((card: DtoCard) => new CardViewmodel(card))
              .sort((a: CardViewmodel, b: CardViewmodel) => a.collectorNumberSortValue.localeCompare(b.collectorNumberSortValue)));
          });
      } else {
        setCards(new Array<CardViewmodel>());
      }
    },
    [props.selectedSets]
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <LanguagesContext.Consumer>
      {
        (languages: Array<DtoLanguage>) => (
          <BaseCardsTableView<CardViewmodel>
            columnDefinitions={getColumnDefinitions(languages)}
            data={cards}
            onCardsSelected={(cards?: Array<CardViewmodel>) => props.onCardsSelected(cards)}
          />
        )
      }
    </LanguagesContext.Consumer>
  );
  //#endregion

  function getColumnDefinitions(languages: Array<DtoLanguage>): Array<React.ReactElement<ColumnProps>> {
    const result = new Array<React.ReactElement<ColumnProps>>();
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.collectorNumber)} name="Number" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.rarity)} name="Rarity" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.cardName)} name="Name" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.cardtypeLine)} name="Type" />);
    result.push(<Column cellRenderer={symbolRenderer(cards, (card: CardViewmodel) => card.cardManacost)} name="Mana cost" />);
    result.push(<Column cellRenderer={cardSetNameRenderer(cards, props.selectedSets, (card: CardViewmodel) => card.setId)} name="Set" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.cardPower)} name="Power" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.cardThoughness)} name="Thoughness" />);
    result.push(<Column cellRenderer={symbolRenderer(cards, (card: CardViewmodel) => card.colorIdentity)} name="CI" />);
    result.push(<Column cellRenderer={languageRenderer(languages, (card: CardViewmodel) => card.languages)} name="Languages" />);
    return result;
  }

  function languageRenderer(languages: Array<DtoLanguage>, valueCallBack: (card: CardViewmodel) => Array<string>): CellRenderer {
    return (row: number) => (
      <Cell>
        {
          valueCallBack(cards[row])
            .map((language: MTGLanguage) => {
              const languageDef = languages.find((lng: DtoLanguage) => lng.id == language);
              return languageDef ? languageDef.button_text : language;
            })
            .join(", ")
        }
      </Cell>
    );
  }
}
