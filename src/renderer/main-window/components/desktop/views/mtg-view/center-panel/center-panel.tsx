import { Menu, MenuItem } from "@blueprintjs/core";
import { MenuContext } from "@blueprintjs/table";
import * as React from "react";
import { ILanguageDto, IMtgCardLanguageDto, IMtgCardListDto, IMtgCardSetDto, IOwnedCardQuantityDto } from "../../../../../../../common/dto";
import { BaseLookupResult, GenericTextColumn, GenericTextLookupResult, IBaseColumn } from "../../../../../../shared/components/base";
import { CardSetColumn, CardSetLookupResult, CardTableView, CollectiorNumberColumn, ColorIdentityColumn, ManaCostColumn } from "../../../../../../shared/components/card-table-view";
import { OwnedCardDialog } from "../../../../../../shared/components/owned-card";
import { CardSetContext, DisplayValueService, DisplayValueServiceContext, IpcProxyService, IpcProxyServiceContext, LanguagesContext } from "../../../../../../shared/context";
import { MtgCardListViewmodel } from "../../../../../viewmodels";
import { CenterPanelProps } from "./center-panel.props";


export function CenterPanel(props: CenterPanelProps) {
  //#region State -------------------------------------------------------------
  const initialState = new Array<MtgCardListViewmodel>();
  const [cards, setCards] = React.useState<Array<MtgCardListViewmodel>>(initialState);
  const [showOwnerShipDialog, setShowOwnerShipDialog] = React.useState<string>(null);
  //#endregion

  //#region Context -----------------------------------------------------------
  const cardSetContext = React.useContext<Array<IMtgCardSetDto>>(CardSetContext);
  const displayValueService = React.useContext<DisplayValueService>(DisplayValueServiceContext);
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  const languagesContext = React.useContext<Array<ILanguageDto>>(LanguagesContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      if (props.selectedSet) {
        void ipcProxyService
          .getData(`/card/query?set=${props.selectedSet.id}`)
          .then(
            (cardResult: Array<IMtgCardListDto>) => setCards(cardResult
              .map((card: IMtgCardListDto) => new MtgCardListViewmodel(card))
              .sort((a: MtgCardListViewmodel, b: MtgCardListViewmodel) => a.collectorNumberSortValue.localeCompare(b.collectorNumberSortValue))),
            (_r: Error) => setCards(initialState)
          );
      } else if (props.queryString) {
        void ipcProxyService
          .getData(`/card/query?${props.queryString}`)
          .then(
            (cardResult: Array<IMtgCardListDto>) => setCards(cardResult
              .map((card: IMtgCardListDto) => new MtgCardListViewmodel(card))
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
      let columNumber = 0;
      result.push(new CollectiorNumberColumn<MtgCardListViewmodel>(
        columNumber++,
        "Number",
        (card: MtgCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, displayValue: card.collectorNumber };
        }
      ));
      result.push(new GenericTextColumn<MtgCardListViewmodel>(
        columNumber++,
        "Rarity",
        (card: MtgCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: displayValueService.cardRarityDisplayValues[card.rarity] };
        }
      ));
      result.push(new GenericTextColumn<MtgCardListViewmodel>(
        columNumber++,
        "Name",
        (card: MtgCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardName };
        }
      ));
      result.push(new GenericTextColumn<MtgCardListViewmodel>(
        columNumber++,
        "Type",
        (card: MtgCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardTypeLine };
        }
      ));
      result.push(new ManaCostColumn<MtgCardListViewmodel>(
        columNumber++,
        "Mana cost",
        (card: MtgCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, convertedManaCost: card.convertedManaCostSortValue, symbols: card.cardManacost };
        }
      ));
      result.push(new CardSetColumn<MtgCardListViewmodel>(6, "Set", (card: MtgCardListViewmodel) => cardSetCallback(card)));
      result.push(new GenericTextColumn<MtgCardListViewmodel>(
        columNumber++,
        "Power",
        (card: MtgCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardPower };
        }
      ));
      result.push(new GenericTextColumn<MtgCardListViewmodel>(
        columNumber++,
        "Thoughness",
        (card: MtgCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardThoughness };
        }
      ));
      result.push(new ColorIdentityColumn<MtgCardListViewmodel>(
        columNumber++,
        "CI",
        (card: MtgCardListViewmodel) => {
          return {
            defaultSortColumn: card.collectorNumberSortValue,
            colorIdentitySortValue: card.colorIdentitySortValue,
            symbols: card.colorIdentity
          };
        }
      ));
      result.push(new GenericTextColumn<MtgCardListViewmodel>(
        columNumber++,
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
    <>
      <CardTableView<MtgCardListViewmodel>
        bodyContextMenuRenderer={(context: MenuContext) => contextMenu(context)}
        data={cards}
        hideSplashScreen={undefined}
        onDataSelected={(cards?: Array<MtgCardListViewmodel>) => props.onCardsSelected(cards)}
        showSplashScreen={undefined}
        sortableColumnDefintions={sortableColumnDefinitions}
      />
      {
        showOwnerShipDialog &&
        <OwnedCardDialog
          cardId={showOwnerShipDialog}
          className={props.className}
          onClose={(_q: Array<IOwnedCardQuantityDto>) => setShowOwnerShipDialog(null)}
        />
      }
    </>
  );

  function contextMenu(context: MenuContext): React.JSX.Element {
    /* NOW once sorted this 'props.decks[context.getTarget().rows[0]]' is wrong */
    const card: MtgCardListViewmodel = cards[context.getTarget().rows[0]];
    // TODO consider allowing increasing over the limit and coloring the value (or row) if too high
    return (
      <Menu>
        <MenuItem
          key="collection"
          onClick={() => setShowOwnerShipDialog(card.cardId)}
          text="Add to/remove from collections"
        />
        <MenuItem
          disabled={true}
          key="deck"
          // onClick={() => props.onCardDecrease(card)}
          text="Add to/remove from decks"
        />
      </Menu>
    );
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function cardSetCallback(card: MtgCardListViewmodel): CardSetLookupResult {
    const cardSet = cardSetContext.find((set: IMtgCardSetDto) => set.id == card.setId);
    return cardSet
      ? { defaultSortColumn: card.collectorNumberSortValue, cardSetName: cardSet.name, svg: undefined, rarity: card.rarity }
      : { defaultSortColumn: card.collectorNumberSortValue, cardSetName: card.setId, svg: undefined, rarity: card.rarity };
  }

  function languageCallback(card: MtgCardListViewmodel): GenericTextLookupResult {
    return {
      defaultSortColumn: card.collectorNumberSortValue,
      textValue: card.languages
        .map((language: IMtgCardLanguageDto) => {
          const languageDef = languagesContext.find((lng: ILanguageDto) => lng.id == language.lang);
          return languageDef ? languageDef.button_text : language.lang;
        })
        .join(", ")
    };
  }
  //#endregion
}
