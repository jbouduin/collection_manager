import * as React from "react";

import { Cell, CellRenderer, Column, ColumnProps } from "@blueprintjs/table";
import { DtoCard, DtoLanguage } from "../../../../../../../common/dto";
import { MTGLanguage } from "../../../../../../../common/enums";
import { CardQueryOptions, QueryParam } from "../../../../../../../common/ipc-params";
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
        window.ipc.query(cardQueryParam)
          .then((cardResult: Array<DtoCard>) => {
            setCards(
              cardResult
                .map((card: DtoCard) => new CardViewmodel(card))
                .sort((a: CardViewmodel, b: CardViewmodel) => a.collectorNumberSortValue.localeCompare(b.collectorNumberSortValue))
            );
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
            data={cards}
            onCardsSelected={props.onCardsSelected}
            columnDefinitions={getColumnDefinitions(languages)}
          />
        )
      }
    </LanguagesContext.Consumer>
  );
  //#endregion

  function getColumnDefinitions(languages: Array<DtoLanguage>): Array<React.ReactElement<ColumnProps>> {
    const result = new Array<React.ReactElement<ColumnProps>>();
    result.push(<Column name="Number" cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.collectorNumber)} />);
    result.push(<Column name="Rarity" cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.rarity)} />);
    result.push(<Column name="Name" cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.cardName)} />);
    result.push(<Column name="Type" cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.cardtypeLine)} />);
    result.push(<Column name="Mana cost" cellRenderer={symbolRenderer(cards, (card: CardViewmodel) => card.cardManacost)} />);
    result.push(<Column name="Set" cellRenderer={cardSetNameRenderer(cards, props.selectedSets, (card: CardViewmodel) => card.setId)} />);
    result.push(<Column name="Power" cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.cardPower)} />);
    result.push(<Column name="Thoughness" cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.cardThoughness)} />);
    result.push(<Column name="CI" cellRenderer={symbolRenderer(cards, (card: CardViewmodel) => card.colorIdentity)} />);
    result.push(<Column name="Languages" cellRenderer={languageRenderer(languages, (card: CardViewmodel) => card.languages)} />);
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
