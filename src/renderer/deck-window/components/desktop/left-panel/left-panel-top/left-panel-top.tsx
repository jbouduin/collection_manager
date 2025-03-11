import * as React from "react";
import { MtgCardSetDto } from "../../../../../../common/dto";
import { BaseLookupResult, GenericTextColumn, GenericTextLookupResult, IBaseColumn } from "../../../../../shared/components/base";
import { CardSetColumn, CardSetLookupResult, CardTableView, CollectiorNumberColumn, ColorIdentityColumn, ManaCostColumn } from "../../../../../shared/components/card-table-view";
import { CardSetContext } from "../../../../../shared/context";
import { LeftPanelTopProps } from "./left-panel-top.props";
import { DeckCardListViewmodel } from "../../../../viewmodels";

export function LeftPanelTop(props: LeftPanelTopProps) {
  //#region Context -----------------------------------------------------------
  const cardSetContext = React.useContext<Array<MtgCardSetDto>>(CardSetContext);
  //#endregion

  //#region Memo --------------------------------------------------------------
  const sortableColumnDefinitions = React.useMemo(
    () => {
      const result = new Array<IBaseColumn<DeckCardListViewmodel, BaseLookupResult>>();
      result.push(new CollectiorNumberColumn<DeckCardListViewmodel>(
        0,
        "Number",
        (card: DeckCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, displayValue: card.collectorNumber };
        }
      ));
      result.push(new GenericTextColumn<DeckCardListViewmodel>(
        1,
        "Rarity",
        (card: DeckCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.rarity };
        }
      ));
      result.push(new GenericTextColumn<DeckCardListViewmodel>(
        2,
        "Name",
        (card: DeckCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardName };
        }
      ));
      result.push(new GenericTextColumn<DeckCardListViewmodel>(
        3,
        "Type",
        (card: DeckCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardTypeLine };
        }
      ));
      result.push(new ManaCostColumn<DeckCardListViewmodel>(
        5,
        "Mana cost",
        (card: DeckCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, convertedManaCost: card.convertedManaCostSortValue, symbols: card.cardManacost };
        }
      ));
      result.push(new CardSetColumn<DeckCardListViewmodel>(6, "Set", (card: DeckCardListViewmodel) => cardSetCallback(card)));
      result.push(new GenericTextColumn<DeckCardListViewmodel>(
        6,
        "Power",
        (card: DeckCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardPower };
        }
      ));
      result.push(new GenericTextColumn<DeckCardListViewmodel>(
        7,
        "Thoughness",
        (card: DeckCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardThoughness };
        }
      ));
      result.push(new ColorIdentityColumn<DeckCardListViewmodel>(
        8,
        "CI",
        (card: DeckCardListViewmodel) => {
          return {
            defaultSortColumn: card.collectorNumberSortValue,
            colorIdentitySortValue: card.colorIdentitySortValue,
            symbols: card.colorIdentity
          };
        }
      ));
      result.push(new GenericTextColumn<DeckCardListViewmodel>(
        9,
        "Language",
        (card: DeckCardListViewmodel) => languageCallback(card)
      ));
      return result;
    },
    []
  );
  //#endregion

  //#region Rendering ---------------------------------------------------------
  /*
   * NOW one table for deck and one table for sideboard (eventually put them in collapsibles)
   */
  return (
    <CardTableView<DeckCardListViewmodel>
      data={props.cards}
      hideSplashScreen={undefined}
      onDataSelected={(cards: Array<DeckCardListViewmodel>) => props.onCardsSelected(cards)}
      showSplashScreen={undefined}
      sortableColumnDefintions={sortableColumnDefinitions}
    />
  );

  function cardSetCallback(card: DeckCardListViewmodel): CardSetLookupResult {
    const cardSet = cardSetContext.find((set: MtgCardSetDto) => set.id == card.setId);
    return cardSet
      ? { defaultSortColumn: card.collectorNumberSortValue, cardSetName: cardSet.name, svg: undefined, rarity: card.rarity }
      : { defaultSortColumn: card.collectorNumberSortValue, cardSetName: card.setId, svg: undefined, rarity: card.rarity };
  }

  function languageCallback(card: DeckCardListViewmodel): GenericTextLookupResult {
    return {
      defaultSortColumn: card.collectorNumberSortValue,
      textValue: card.language
    };
  }
  //#endregion
}
