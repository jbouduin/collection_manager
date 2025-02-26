import * as React from "react";
import { LanguageDto, OwnedCardDto, OwnedCardListDto } from "../../../../../../../common/dto";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../../common/context";
import { BaseCardsTableView } from "../../../../../components/common/base-cards-table-view/base-cards-table-view";
import { CardConditionContext, CardSetContext, LanguagesContext } from "../../../../../components/context";
import { CardConditionViewmodel, CardSetViewmodel, CollectionCardListViewmodel } from "../../../../../viewmodels";
import { BaseLookupResult, CardSetColumn, CardSetLookupResult, IBaseColumn, TextColumn, TextLookupResult } from "../../../../common/base-cards-table-view/columns";
import { CenterPanelProps } from "./center-panel.props";


export function CenterPanel(props: CenterPanelProps) {
  //#region State -------------------------------------------------------------
  const [cards, setCards] = React.useState(new Array<CollectionCardListViewmodel>());
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const cardSetContext = React.useContext<Array<CardSetViewmodel>>(CardSetContext);
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  const languagesContext = React.useContext<Array<LanguageDto>>(LanguagesContext);
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
    <CardConditionContext.Consumer>
      {
        (conditions: Array<CardConditionViewmodel>) => (
          <BaseCardsTableView<CollectionCardListViewmodel>
            data={cards}
            onCardsSelected={(cards?: Array<CollectionCardListViewmodel>) => props.onCardsSelected(cards)}
            sortableColumnDefintions={getSortableColumnDefinitions(conditions)}
          />
        )
      }
    </CardConditionContext.Consumer>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function getSortableColumnDefinitions(conditions: Array<CardConditionViewmodel>): Array<IBaseColumn<CollectionCardListViewmodel, BaseLookupResult>> {
    const result = new Array<IBaseColumn<CollectionCardListViewmodel, BaseLookupResult>>();
    result.push(new CardSetColumn<CollectionCardListViewmodel>(0, "Set", (card: CollectionCardListViewmodel) => cardSetCallback(card)));
    result.push(new TextColumn<CollectionCardListViewmodel>(
      1,
      "Rarity",
      (card: CollectionCardListViewmodel) => {
        return { collectorNumberSortValue: card.collectorNumberSortValue, textValue: card.rarity };
      }
    ));
    result.push(new TextColumn<CollectionCardListViewmodel>(2, "Language", languageCallback));
    result.push(new TextColumn<CollectionCardListViewmodel>(
      3,
      "Name",
      (card: CollectionCardListViewmodel) => {
        return { collectorNumberSortValue: card.collectorNumberSortValue, textValue: card.cardName };
      }
    ));
    conditions.forEach((condition: CardConditionViewmodel, idx: number) => {
      // TODO sort by foil / non foil / total
      result.push(new TextColumn<CollectionCardListViewmodel>(4 + idx, condition.expression, getQuantityCallback(condition.id)));
    });
    return result;
  }

  function languageCallback(card: CollectionCardListViewmodel): TextLookupResult {
    const languageDef = languagesContext.find((lng: LanguageDto) => lng.id == card.language);
    return languageDef
      ? { collectorNumberSortValue: card.collectorNumberSortValue, textValue: languageDef.button_text }
      : { collectorNumberSortValue: card.collectorNumberSortValue, textValue: card.language };
  }

  function cardSetCallback(card: CollectionCardListViewmodel): CardSetLookupResult {
    const cardSet = cardSetContext.find((set: CardSetViewmodel) => set.id == card.setId);
    return cardSet
      ? { collectorNumberSortValue: card.collectorNumberSortValue, cardSetName: cardSet.cardSetName, svg: cardSet.cardSetSvg, rarity: card.rarity }
      : { collectorNumberSortValue: card.collectorNumberSortValue, cardSetName: card.setId, svg: undefined, rarity: card.rarity };
  }

  function getQuantityCallback(condition: string): (card: CollectionCardListViewmodel) => TextLookupResult {
    return (card: CollectionCardListViewmodel) => {
      const foil = card.ownedCards.find((ownedCard: OwnedCardDto) => ownedCard.condition_id == condition && ownedCard.is_foil == true)?.quantity || 0;
      const nonFoil = card.ownedCards.find((ownedCard: OwnedCardDto) => ownedCard.condition_id == condition && ownedCard.is_foil == false)?.quantity || 0;
      return { collectorNumberSortValue: card.collectorNumberSortValue, textValue: `${nonFoil} non-foil / ${foil} foil` };
    };
  }
  //#endregion
}
