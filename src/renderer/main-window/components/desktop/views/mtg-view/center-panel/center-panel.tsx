import * as React from "react";
import { LanguageDto, MtgCardListDto, MtgCardSetDto } from "../../../../../../../common/dto";
import { MTGLanguage } from "../../../../../../../common/types";
import { BaseCardsTableView, BaseLookupResult, CardSetColumn, CardSetLookupResult, CollectiorNumberColumn, ColorIdentityColumn, GenericTextColumn, GenericTextLookupResult, IBaseColumn, ManaCostColumn } from "../../../../../../shared/components";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../../shared/context";
import { CardSetContext, LanguagesContext } from "../../../../../components/context";
import { MtgCardListViewmodel } from "../../../../../viewmodels";
import { CenterPanelProps } from "./center-panel.props";


export function CenterPanel(props: CenterPanelProps) {
  //#region State -------------------------------------------------------------
  const initialState = new Array<MtgCardListViewmodel>();
  const [cards, setCards] = React.useState<Array<MtgCardListViewmodel>>(initialState);
  //#endregion

  //#region Context -----------------------------------------------------------
  const cardSetContext = React.useContext<Array<MtgCardSetDto>>(CardSetContext);
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  const languagesContext = React.useContext<Array<LanguageDto>>(LanguagesContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      if (props.selectedSet) {
        void ipcProxyService
          .getData(`/card/query?set=${props.selectedSet.id}`)
          .then(
            (cardResult: Array<MtgCardListDto>) => setCards(cardResult
              .map((card: MtgCardListDto) => new MtgCardListViewmodel(card))
              .sort((a: MtgCardListViewmodel, b: MtgCardListViewmodel) => a.collectorNumberSortValue.localeCompare(b.collectorNumberSortValue))),
            (_r: Error) => setCards(initialState)
          );
      } else if (props.queryString) {
        void ipcProxyService
          .getData(`/card/query?${props.queryString}`)
          .then(
            (cardResult: Array<MtgCardListDto>) => setCards(cardResult
              .map((card: MtgCardListDto) => new MtgCardListViewmodel(card))
              .sort((a: MtgCardListViewmodel, b: MtgCardListViewmodel) => a.collectorNumberSortValue.localeCompare(b.collectorNumberSortValue))),
            (_r: Error) => setCards(initialState)
          );
      } else {
        setCards(initialState);
      }
    },
    [props.selectedSet, props.queryString]
  );
  //#endregion

  //#region Memo --------------------------------------------------------------
  const sortableColumnDefinitions = React.useMemo(
    () => {
      const result = new Array<IBaseColumn<MtgCardListViewmodel, BaseLookupResult>>();
      result.push(new CollectiorNumberColumn<MtgCardListViewmodel>(
        0,
        "Number",
        (card: MtgCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, displayValue: card.collectorNumber };
        }
      ));
      result.push(new GenericTextColumn<MtgCardListViewmodel>(
        1,
        "Rarity",
        (card: MtgCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.rarity };
        }
      ));
      result.push(new GenericTextColumn<MtgCardListViewmodel>(
        2,
        "Name",
        (card: MtgCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardName };
        }
      ));
      result.push(new GenericTextColumn<MtgCardListViewmodel>(
        3,
        "Type",
        (card: MtgCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardTypeLine };
        }
      ));
      result.push(new ManaCostColumn<MtgCardListViewmodel>(
        5,
        "Mana cost",
        (card: MtgCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, convertedManaCost: card.convertedManaCostSortValue, symbols: card.cardManacost };
        }
      ));
      result.push(new CardSetColumn<MtgCardListViewmodel>(6, "Set", (card: MtgCardListViewmodel) => cardSetCallback(card)));
      result.push(new GenericTextColumn<MtgCardListViewmodel>(
        6,
        "Power",
        (card: MtgCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardPower };
        }
      ));
      result.push(new GenericTextColumn<MtgCardListViewmodel>(
        7,
        "Thoughness",
        (card: MtgCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardThoughness };
        }
      ));
      result.push(new ColorIdentityColumn<MtgCardListViewmodel>(
        8,
        "CI",
        (card: MtgCardListViewmodel) => {
          return {
            defaultSortColumn: card.collectorNumberSortValue,
            colorIdentitySortValue: card.coloridentitySortValue,
            symbols: card.colorIdentity
          };
        }
      ));
      result.push(new GenericTextColumn<MtgCardListViewmodel>(
        9,
        "Languages",
        (card: MtgCardListViewmodel) => languageCallback(card)
      ));
      return result;
    },
    []
  );
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <BaseCardsTableView<MtgCardListViewmodel>
      data={cards}
      onCardsSelected={(cards?: Array<MtgCardListViewmodel>) => props.onCardsSelected(cards)}
      sortableColumnDefintions={sortableColumnDefinitions}
    />
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------


  function cardSetCallback(card: MtgCardListViewmodel): CardSetLookupResult {
    const cardSet = cardSetContext.find((set: MtgCardSetDto) => set.id == card.setId);
    return cardSet
      ? { defaultSortColumn: card.collectorNumberSortValue, cardSetName: cardSet.name, svg: undefined, rarity: card.rarity }
      : { defaultSortColumn: card.collectorNumberSortValue, cardSetName: card.setId, svg: undefined, rarity: card.rarity };
  }

  function languageCallback(card: MtgCardListViewmodel): GenericTextLookupResult {
    return {
      defaultSortColumn: card.collectorNumberSortValue,
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
