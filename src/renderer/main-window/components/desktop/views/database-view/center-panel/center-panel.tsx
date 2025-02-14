import { Cell, CellRenderer, Column, ColumnProps } from "@blueprintjs/table";
import * as React from "react";
import { CardDto, LanguageDto } from "../../../../../../../common/dto";
import { MTGLanguage } from "../../../../../../../common/types";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../../common/context";
import { BaseCardsTableView } from "../../../../../components/common/base-cards-table-view/base-cards-table-view";
import { cardSetNameRenderer, symbolRenderer, textCellRenderer } from "../../../../../components/common/base-cards-table-view/cell-renderers";
import { LanguagesContext } from "../../../../../components/context";
import { CardSetViewmodel, CardViewmodel } from "../../../../../viewmodels";
import { CenterPanelProps } from "./center-panel.props";


export function CenterPanel(props: CenterPanelProps) {
  //#region State -------------------------------------------------------------
  const [cards, setCards] = React.useState(new Array<CardViewmodel>());
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      if (props.selectedSets) {
        void ipcProxyService
          .getData(`/card/query?sets=${props.selectedSets.map((set: CardSetViewmodel) => set.id).join(",")}`)
          .then((cardResult: Array<CardDto>) => {
            setCards(cardResult
              .map((card: CardDto) => new CardViewmodel(card))
              .sort((a: CardViewmodel, b: CardViewmodel) => a.collectorNumberSortValue.localeCompare(b.collectorNumberSortValue)))
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
        (languages: Array<LanguageDto>) => (
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

  function getColumnDefinitions(languages: Array<LanguageDto>): Array<React.ReactElement<ColumnProps>> {
    const result = new Array<React.ReactElement<ColumnProps>>();
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.collectorNumber)} name="Number" key="Number"/>);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.rarity)} name="Rarity" key="Rarity" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.cardName)} name="Name" key="Name" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.cardtypeLine)} name="Type" key="Type" />);
    result.push(<Column cellRenderer={symbolRenderer(cards, (card: CardViewmodel) => card.cardManacost)} name="Mana cost" key="ManaCost" />);
    result.push(<Column cellRenderer={cardSetNameRenderer(cards, props.selectedSets, (card: CardViewmodel) => card.setId)} name="Set" key="Set" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.cardPower)} name="Power" key="Power" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CardViewmodel) => card.cardThoughness)} name="Thoughness" key="Thoughness" />);
    result.push(<Column cellRenderer={symbolRenderer(cards, (card: CardViewmodel) => card.colorIdentity)} name="CI" key="CI" />);
    result.push(<Column cellRenderer={languageRenderer(languages, (card: CardViewmodel) => card.languages)} name="Languages" key="Languages" />);
    return result;
  }

  function languageRenderer(languages: Array<LanguageDto>, valueCallBack: (card: CardViewmodel) => Array<string>): CellRenderer {
    return (row: number) => (
      <Cell>
        {
          valueCallBack(cards[row])
            .map((language: MTGLanguage) => {
              const languageDef = languages.find((lng: LanguageDto) => lng.id == language);
              return languageDef ? languageDef.button_text : language;
            })
            .join(", ")
        }
      </Cell>
    );
  }
}
