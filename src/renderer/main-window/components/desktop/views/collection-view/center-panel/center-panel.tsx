import { Cell, CellRenderer, Column, ColumnProps } from "@blueprintjs/table";
import * as React from "react";
import { LanguageDto, OwnedCardDto, OwnedCardListDto } from "../../../../../../../common/dto";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../../common/context";
import { BaseCardsTableView } from "../../../../../components/common/base-cards-table-view/base-cards-table-view";
import { cardSetRenderer, textCellRenderer } from "../../../../../components/common/base-cards-table-view/cell-renderers";
import { CardConditionContext, CardSetContext, LanguagesContext } from "../../../../../components/context";
import { CardConditionViewmodel, CardSetViewmodel, CollectionCardListViewmodel } from "../../../../../viewmodels";
import { CenterPanelProps } from "./center-panel.props";
import { MTGLanguage } from "../../../../../../../common/types";


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
          .getData<Array<OwnedCardListDto>>(`/collection/${props.selectedCollection.id}/card`)
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

  //#region Rendering ---------------------------------------------------------
  return (
    <LanguagesContext.Consumer>
      {
        (languages: Array<LanguageDto>) => (
          <CardSetContext.Consumer>
            {
              (cardSets: Array<CardSetViewmodel>) => (
                <CardConditionContext.Consumer>
                  {
                    (conditions: Array<CardConditionViewmodel>) => (
                      <BaseCardsTableView<CollectionCardListViewmodel>
                        columnDefinitions={getColumnDefinitions(languages, cardSets, conditions)}
                        data={cards}
                        onCardsSelected={(cards?: Array<CollectionCardListViewmodel>) => props.onCardsSelected(cards)}
                      />
                    )
                  }
                </CardConditionContext.Consumer>
              )
            }
          </CardSetContext.Consumer>
        )
      }
    </LanguagesContext.Consumer>
  );

  function getColumnDefinitions(languages: Array<LanguageDto>, cardSets: Array<CardSetViewmodel>, conditions: Array<CardConditionViewmodel>): Array<React.ReactElement<ColumnProps>> {
    const result = new Array<React.ReactElement<ColumnProps>>();
    result.push(<Column cellRenderer={cardSetRenderer(cards, cardSets, (card: CollectionCardListViewmodel) => card.setId)} key="Set" name="Set" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.rarity)} key="Rarity" name="Rarity" />);
    result.push(<Column cellRenderer={languageRenderer(languages, (card: CollectionCardListViewmodel) => card.language)} key="Language" name="Language" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.cardName)} key="Name" name="Name" />);
    conditions.forEach((condition: CardConditionViewmodel) => {
      result.push(<Column cellRenderer={quantityRenderer(condition.code, (card: CollectionCardListViewmodel) => card.ownedCards)} key={condition.code} name={condition.expression} />);
    });
    /*
     * result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.cardTypeLine)} key="Type" name="Type" />);
     * result.push(<Column cellRenderer={symbolRenderer(cards, (card: CollectionCardListViewmodel) => card.cardManacost)} key="Mana cost" name="ManaCost" />);
     * result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.cardPower)} key="Power" name="Power" />);
     * result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.cardThoughness)} key="Thoughness" name="Thoughness" />);
     * result.push(<Column cellRenderer={symbolRenderer(cards, (card: CollectionCardListViewmodel) => card.colorIdentity)} key="CI" name="CI" />);
     */
    return result;
  }

  function languageRenderer(languages: Array<LanguageDto>, valueCallBack: (card: CollectionCardListViewmodel) => MTGLanguage): CellRenderer {
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

  function quantityRenderer(condition: string, valueCallBack: (card: CollectionCardListViewmodel) => Array<OwnedCardDto>): CellRenderer {
    return (row: number) => {
      const ownedCards = valueCallBack(cards[row]);
      const foil = ownedCards.find((ownedCard: OwnedCardDto) => ownedCard.condition_id == condition && ownedCard.is_foil == true)?.quantity || 0;
      const nonFoil = ownedCards.find((ownedCard: OwnedCardDto) => ownedCard.condition_id == condition && ownedCard.is_foil == false)?.quantity || 0;
      return (
        <Cell>
          {`${nonFoil} non-foil / ${foil} foil`}
        </Cell>
      );
    };
  }
  //#endregion
}
