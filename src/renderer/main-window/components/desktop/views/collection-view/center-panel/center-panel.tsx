import * as React from "react";
import { LanguageDto, MtgCardSetDto, OwnedCardDto, OwnedCardListDto } from "../../../../../../../common/dto";
import { BaseCardTableView, BaseLookupResult, CardSetColumn, CardSetLookupResult, GenericTextColumn, GenericTextLookupResult, IBaseColumn } from "../../../../../../shared/components";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../../shared/context";
import { CardConditionContext, CardSetContext, LanguagesContext } from "../../../../../components/context";
import { CardConditionViewmodel, CollectionCardListViewmodel } from "../../../../../viewmodels";
import { CenterPanelProps } from "./center-panel.props";


export function CenterPanel(props: CenterPanelProps) {
  //#region State -------------------------------------------------------------
  const [cards, setCards] = React.useState(new Array<CollectionCardListViewmodel>());
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const cardConditionContext = React.useContext<Array<CardConditionViewmodel>>(CardConditionContext);
  const cardSetContext = React.useContext<Array<MtgCardSetDto>>(CardSetContext);
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
            (result: Array<OwnedCardListDto>) => setCards(result
              .map((c: OwnedCardListDto) => new CollectionCardListViewmodel(c))
              .sort((a: CollectionCardListViewmodel, b: CollectionCardListViewmodel) => a.dateSortValue.localeCompare(b.dateSortValue))),
            (_r: Error) => setCards(new Array<CollectionCardListViewmodel>())
          );
      } else {
        setCards(new Array<CollectionCardListViewmodel>());
      }
    },
    [props.selectedCollection]
  );
  //#endregion

  //#region Memo --------------------------------------------------------------
  const sortableColumnDefinitions = React.useMemo(
    () => {
      const result = new Array<IBaseColumn<CollectionCardListViewmodel, BaseLookupResult>>();
      result.push(new CardSetColumn<CollectionCardListViewmodel>(0, "Set", (card: CollectionCardListViewmodel) => cardSetCallback(card)));
      result.push(new GenericTextColumn<CollectionCardListViewmodel>(
        1,
        "Rarity",
        (card: CollectionCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.rarity };
        }
      ));
      result.push(new GenericTextColumn<CollectionCardListViewmodel>(2, "Language", languageCallback));
      result.push(new GenericTextColumn<CollectionCardListViewmodel>(
        3,
        "Name",
        (card: CollectionCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardName };
        }
      ));
      cardConditionContext.forEach((condition: CardConditionViewmodel, idx: number) => {
        // TODO sort by foil / non foil / total
        result.push(new GenericTextColumn<CollectionCardListViewmodel>(4 + idx, condition.expression, getQuantityCallback(condition.id)));
      });
      return result;
    },
    [cardConditionContext]
  );
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <BaseCardTableView<CollectionCardListViewmodel>
      data={cards}
      hideSplashScreen={undefined}
      onDataSelected={(cards?: Array<CollectionCardListViewmodel>) => props.onCardsSelected(cards)}
      showSplashScreen={undefined}
      sortableColumnDefintions={sortableColumnDefinitions}
    />
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function languageCallback(card: CollectionCardListViewmodel): GenericTextLookupResult {
    const languageDef = languagesContext.find((lng: LanguageDto) => lng.id == card.language);
    return languageDef
      ? { defaultSortColumn: card.collectorNumberSortValue, textValue: languageDef.button_text }
      : { defaultSortColumn: card.collectorNumberSortValue, textValue: card.language };
  }

  function cardSetCallback(card: CollectionCardListViewmodel): CardSetLookupResult {
    const cardSet = cardSetContext.find((set: MtgCardSetDto) => set.id == card.setId);
    return cardSet
      ? { defaultSortColumn: card.collectorNumberSortValue, cardSetName: cardSet.name, svg: cardSet.svg, rarity: card.rarity }
      : { defaultSortColumn: card.collectorNumberSortValue, cardSetName: card.setId, svg: undefined, rarity: card.rarity };
  }

  function getQuantityCallback(condition: string): (card: CollectionCardListViewmodel) => GenericTextLookupResult {
    return (card: CollectionCardListViewmodel) => {
      const foil = card.ownedCards.find((ownedCard: OwnedCardDto) => ownedCard.condition_id == condition && ownedCard.is_foil == true)?.quantity || 0;
      const nonFoil = card.ownedCards.find((ownedCard: OwnedCardDto) => ownedCard.condition_id == condition && ownedCard.is_foil == false)?.quantity || 0;
      return { defaultSortColumn: card.collectorNumberSortValue, textValue: `${nonFoil} non-foil / ${foil} foil` };
    };
  }
  //#endregion
}
