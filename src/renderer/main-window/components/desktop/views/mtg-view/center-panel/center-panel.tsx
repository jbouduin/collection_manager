import * as React from "react";
import { LanguageDto, MtgCardListDto } from "../../../../../../../common/dto";
import { MTGLanguage } from "../../../../../../../common/types";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../../common/context";
import { BaseCardsTableView } from "../../../../../components/common/base-cards-table-view/base-cards-table-view";
import { CardSetContext, LanguagesContext } from "../../../../../components/context";
import { CardSetViewmodel, MtgCardListViewmodel } from "../../../../../viewmodels";
import { BaseLookupResult, CardSetColumn, CardSetLookupResult, CollectiorNumberColumn, ColorIdentityColumn, IBaseColumn, ManaCostColumn, TextColumn, TextLookupResult } from "../../../../common/base-cards-table-view/columns";
import { CenterPanelProps } from "./center-panel.props";


export function CenterPanel(props: CenterPanelProps) {
  //#region State -------------------------------------------------------------
  const [cards, setCards] = React.useState(new Array<MtgCardListViewmodel>());
  //#endregion

  //#region Context ---------------------------------------------------------------------
  const cardSetContext = React.useContext<Array<CardSetViewmodel>>(CardSetContext);
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  const languagesContext = React.useContext<Array<LanguageDto>>(LanguagesContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      if (props.selectedSets) {
        void ipcProxyService
          // FEATURE: nultiselect sets in tree .getData(`/card/query?sets=${props.selectedSets.map((set: CardSetViewmodel) => set.id).join(",")}`)
          .getData(`/card/query?sets=${props.selectedSets[0].id}`)
          .then(
            (cardResult: Array<MtgCardListDto>) => {
              setCards(cardResult
                .map((card: MtgCardListDto) => new MtgCardListViewmodel(card))
                .sort((a: MtgCardListViewmodel, b: MtgCardListViewmodel) => a.collectorNumberSortValue.localeCompare(b.collectorNumberSortValue)));
            },
            (_cardResult: Array<MtgCardListDto>) => setCards(new Array<MtgCardListViewmodel>())
          );
      } else if (props.queryString) {
        void ipcProxyService
          .getData(`/card/query?${props.queryString}`)
          .then(
            (cardResult: Array<MtgCardListDto>) => {
              setCards(cardResult
                .map((card: MtgCardListDto) => new MtgCardListViewmodel(card))
                .sort((a: MtgCardListViewmodel, b: MtgCardListViewmodel) => a.collectorNumberSortValue.localeCompare(b.collectorNumberSortValue)));
            },
            (_cardResult: Array<MtgCardListDto>) => setCards(new Array<MtgCardListViewmodel>())
          );
      } else {
        setCards(new Array<MtgCardListViewmodel>());
      }
    },
    [props.selectedSets, props.queryString]
  );
  //#endregion

  //#region Rednering ---------------------------------------------------------
  return (
    <BaseCardsTableView<MtgCardListViewmodel>
      data={cards}
      onCardsSelected={(cards?: Array<MtgCardListViewmodel>) => props.onCardsSelected(cards)}
      sortableColumnDefintions={getSortableColumnDefinitions()}
    />
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function getSortableColumnDefinitions(): Array<IBaseColumn<MtgCardListViewmodel, BaseLookupResult>> {
    const result = new Array<IBaseColumn<MtgCardListViewmodel, BaseLookupResult>>();
    result.push(new CollectiorNumberColumn<MtgCardListViewmodel>(
      0,
      "Number",
      (card: MtgCardListViewmodel) => {
        return { collectorNumberSortValue: card.collectorNumberSortValue, displayValue: card.collectorNumber };
      }
    ));
    result.push(new TextColumn<MtgCardListViewmodel>(
      1,
      "Rarity",
      (card: MtgCardListViewmodel) => {
        return { collectorNumberSortValue: card.collectorNumberSortValue, textValue: card.rarity };
      }
    ));
    result.push(new TextColumn<MtgCardListViewmodel>(
      2,
      "Name",
      (card: MtgCardListViewmodel) => {
        return { collectorNumberSortValue: card.collectorNumberSortValue, textValue: card.cardName };
      }
    ));
    result.push(new TextColumn<MtgCardListViewmodel>(
      3,
      "Type",
      (card: MtgCardListViewmodel) => {
        return { collectorNumberSortValue: card.collectorNumberSortValue, textValue: card.cardTypeLine };
      }
    ));
    result.push(new ManaCostColumn<MtgCardListViewmodel>(
      5,
      "Mana cost",
      (card: MtgCardListViewmodel) => {
        return { collectorNumberSortValue: card.collectorNumberSortValue, convertedManaCost: card.convertedManaCostSortValue, symbols: card.cardManacost };
      }
    ));
    result.push(new CardSetColumn<MtgCardListViewmodel>(6, "Set", (card: MtgCardListViewmodel) => cardSetCallback(card)));
    result.push(new TextColumn<MtgCardListViewmodel>(
      6,
      "Power",
      (card: MtgCardListViewmodel) => {
        return { collectorNumberSortValue: card.collectorNumberSortValue, textValue: card.cardPower };
      }
    ));
    result.push(new TextColumn<MtgCardListViewmodel>(
      7,
      "Thoughness",
      (card: MtgCardListViewmodel) => {
        return { collectorNumberSortValue: card.collectorNumberSortValue, textValue: card.cardThoughness };
      }
    ));
    result.push(new ColorIdentityColumn<MtgCardListViewmodel>(
      8,
      "CI",
      (card: MtgCardListViewmodel) => {
        return {
          collectorNumberSortValue: card.collectorNumberSortValue,
          colorIdentitySortValue: card.coloridentitySortValue,
          symbols: card.colorIdentity
        };
      }
    ));
    result.push(new TextColumn<MtgCardListViewmodel>(
      9,
      "Languages",
      (card: MtgCardListViewmodel) => languageCallback(card)
    ));
    return result;
  }

  function cardSetCallback(card: MtgCardListViewmodel): CardSetLookupResult {
    const cardSet = cardSetContext.find((set: CardSetViewmodel) => set.id == card.setId);
    return cardSet
      ? { collectorNumberSortValue: card.collectorNumberSortValue, cardSetName: cardSet.cardSetName, svg: undefined, rarity: card.rarity }
      : { collectorNumberSortValue: card.collectorNumberSortValue, cardSetName: card.setId, svg: undefined, rarity: card.rarity };
  }

  function languageCallback(card: MtgCardListViewmodel): TextLookupResult {
    return {
      collectorNumberSortValue: card.collectorNumberSortValue,
      textValue: card.languages
        .map((language: MTGLanguage) => {
          const languageDef = languagesContext.find((lng: LanguageDto) => lng.id == language);
          return languageDef ? languageDef.button_text : language;
        })
        .join(", ")
    };
  }
  //#endregion
}
