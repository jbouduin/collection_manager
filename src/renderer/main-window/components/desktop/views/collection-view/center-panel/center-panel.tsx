import { Cell, CellRenderer, Column, ColumnProps } from "@blueprintjs/table";
import * as React from "react";
import { OwnedCardListDto, LanguageDto } from "../../../../../../../common/dto";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../../common/context";
import { BaseCardsTableView } from "../../../../../components/common/base-cards-table-view/base-cards-table-view";
import { symbolRenderer, textCellRenderer } from "../../../../../components/common/base-cards-table-view/cell-renderers";
import { CardSetContext, LanguagesContext } from "../../../../../components/context";
import { CardSetViewmodel, CollectionCardListViewmodel } from "../../../../../viewmodels";
import { CenterPanelProps } from "./center-panel.props";


export function CenterPanel(props: CenterPanelProps) {
  //#region State -------------------------------------------------------------
  const [cards, setCards] = React.useState(new Array<CollectionCardListViewmodel>());
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      if (props.selectedCollection?.isFolder == false) {
        void ipcProxyService
          .getData<Array<OwnedCardListDto>>(`/collection/${props.selectedCollection.id}/cards`)
          .then(
            (result: Array<OwnedCardListDto>) => {
              setCards(result
                .map((c: OwnedCardListDto) => new CollectionCardListViewmodel(c))
                .sort((a: CollectionCardListViewmodel, b: CollectionCardListViewmodel) => a.dateSortValue.localeCompare(b.dateSortValue)));
            },
            (_result: Array<OwnedCardListDto>) => setCards(new Array<CollectionCardListViewmodel>())
          );
      } else {
        setCards(new Array<CollectionCardListViewmodel>());
      }
    },
    [props.selectedCollection]
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <LanguagesContext.Consumer>
      {
        (languages: Array<LanguageDto>) => (
          <CardSetContext.Consumer>
            {
              (cardSets: Array<CardSetViewmodel>) => (
                <BaseCardsTableView<CollectionCardListViewmodel>
                  columnDefinitions={getColumnDefinitions(languages, cardSets)}
                  data={cards}
                  onCardsSelected={(cards?: Array<CollectionCardListViewmodel>) => props.onCardsSelected(cards)}
                />)
            }
          </CardSetContext.Consumer>
        )
      }
    </LanguagesContext.Consumer>
  );
  //#endregion

  function getColumnDefinitions(languages: Array<LanguageDto>, cardSets: Array<CardSetViewmodel>): Array<React.ReactElement<ColumnProps>> {
    const result = new Array<React.ReactElement<ColumnProps>>();
    result.push(<Column cellRenderer={cardSetRenderer(cardSets, (card: CollectionCardListViewmodel) => card.setId)} key="Set" name="Set" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.rarity)} key="Rarity" name="Rarity" />);
    result.push(<Column cellRenderer={languageRenderer(languages, (card: CollectionCardListViewmodel) => card.language)} key="Language" name="Language" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.cardName)} key="Name" name="Name" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.cardTypeLine)} key="Type" name="Type" />);
    result.push(<Column cellRenderer={symbolRenderer(cards, (card: CollectionCardListViewmodel) => card.cardManacost)} key="Mana cost" name="ManaCost" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.cardPower)} key="Power" name="Power" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.cardThoughness)} key="Thoughness" name="Thoughness" />);

    // result.push(<Column cellRenderer={symbolRenderer(cards, (card: CollectionCardListViewmodel) => card.colorIdentity)} key="CI" name="CI" />);

    return result;
  }

  function languageRenderer(languages: Array<LanguageDto>, valueCallBack: (card: CollectionCardListViewmodel) => string): CellRenderer {
    return (row: number) => {
      const language = valueCallBack(cards[row]);
      const languageDef = languages.find((lng: LanguageDto) => lng.id == language);
      return (
        <Cell>
          {languageDef ? languageDef.button_text : language}
        </Cell>
      );
    };
  }

  function cardSetRenderer(cardSets: Array<CardSetViewmodel>, valueCallBack: (card: CollectionCardListViewmodel) => string): CellRenderer {
    return (row: number) => {
      const setId = valueCallBack(cards[row]);
      const cardSet = cardSets.find((cardSetViewmodel: CardSetViewmodel) => cardSetViewmodel.id == setId);
      return (
        <Cell>
          {cardSet ? cardSet.cardSetName : undefined}
        </Cell>
      );
    };
  }
}
