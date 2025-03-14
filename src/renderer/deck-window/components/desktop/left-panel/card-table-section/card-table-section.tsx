import { Menu, MenuItem, Section } from "@blueprintjs/core";
import { MenuContext } from "@blueprintjs/table";
import * as React from "react";
import { IMtgCardSetDto } from "../../../../../../common/dto";
import { BaseLookupResult, GenericTextColumn, GenericTextLookupResult, IBaseColumn } from "../../../../../shared/components/base";
import { GenericNumericColumn } from "../../../../../shared/components/base/base-table/generic-numeric-column";
import { CardSetColumn, CardSetLookupResult, CardTableView, CollectiorNumberColumn, ColorIdentityColumn, ManaCostColumn } from "../../../../../shared/components/card-table-view";
import { CardSetContext, DisplayValueService, DisplayValueServiceContext } from "../../../../../shared/context";
import { DeckCardListViewmodel } from "../../../../viewmodels";
import { CardTableSectionProps } from "./card-table-section.props";

export function CardTableSection(props: CardTableSectionProps) {
  //#region Context -----------------------------------------------------------
  const cardSetContext = React.useContext<Array<IMtgCardSetDto>>(CardSetContext);
  const displayValueService = React.useContext<DisplayValueService>(DisplayValueServiceContext);
  //#endregion

  //#region Sortable columns --------------------------------------------------
  const sortableColumnDefinitions = React.useMemo(
    () => {
      const result = new Array<IBaseColumn<DeckCardListViewmodel, BaseLookupResult>>();
      let columNumber = 0;
      result.push(new CollectiorNumberColumn<DeckCardListViewmodel>(
        columNumber++,
        "Number",
        (card: DeckCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, displayValue: card.collectorNumber };
        }
      ));
      result.push(new GenericTextColumn<DeckCardListViewmodel>(
        columNumber++,
        "Rarity",
        (card: DeckCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: displayValueService.cardRarityDisplayValues[card.rarity] };
        }
      ));
      result.push(new GenericTextColumn<DeckCardListViewmodel>(
        columNumber++,
        "Name",
        (card: DeckCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardName };
        }
      ));
      result.push(new GenericNumericColumn<DeckCardListViewmodel>(
        columNumber++,
        "Quantity",
        (card: DeckCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, numericValue: props.content == "deck" ? card.deckQuantity : card.sideboardQuantity };
        }
      ));
      result.push(new GenericTextColumn<DeckCardListViewmodel>(
        columNumber++,
        "Type",
        (card: DeckCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardTypeLine };
        }
      ));
      result.push(new ManaCostColumn<DeckCardListViewmodel>(
        columNumber++,
        "Mana cost",
        (card: DeckCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, convertedManaCost: card.convertedManaCostSortValue, symbols: card.cardManacost };
        }
      ));
      result.push(new CardSetColumn<DeckCardListViewmodel>(
        columNumber++,
        "Set",
        (card: DeckCardListViewmodel) => cardSetCallback(card)
      ));
      result.push(new GenericTextColumn<DeckCardListViewmodel>(
        columNumber++,
        "Power",
        (card: DeckCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardPower };
        }
      ));
      result.push(new GenericTextColumn<DeckCardListViewmodel>(
        columNumber++,
        "Thoughness",
        (card: DeckCardListViewmodel) => {
          return { defaultSortColumn: card.collectorNumberSortValue, textValue: card.cardThoughness };
        }
      ));
      result.push(new ColorIdentityColumn<DeckCardListViewmodel>(
        columNumber++,
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
        columNumber++,
        "Language",
        (card: DeckCardListViewmodel) => languageCallback(card)
      ));
      return result;
    },
    [props.content]
  );

  function cardSetCallback(card: DeckCardListViewmodel): CardSetLookupResult {
    const cardSet = cardSetContext.find((set: IMtgCardSetDto) => set.id == card.setId);
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

  function totalCards(): number {
    return props.cards
      .reduce<number>((prev: number, card: DeckCardListViewmodel) => prev += props.content == "deck" ? card.deckQuantity : card.sideboardQuantity, 0);
  }
  //#region Rendering ---------------------------------------------------------
  return (
    <Section
      className="deck-card-section"
      collapseProps={{ isOpen: props.isOpen, onToggle: props.onToggleCollaps }}
      collapsible={true}
      compact={true}
      // TODO show as red if total cards is too high or too low
      rightElement={(<p>{totalCards()} Cards</p>)}
      style={props.isOpen ? {} : { height: "40px" }}
      title={props.content == "deck" ? "Deck" : "Sideboard"}
    >
      <CardTableView<DeckCardListViewmodel>
        bodyContextMenuRenderer={(context: MenuContext) => contextMenu(context)}
        data={props.cards}
        hideSplashScreen={undefined}
        onDataSelected={(cards: Array<DeckCardListViewmodel>) => props.onCardsSelected(cards)}
        showSplashScreen={undefined}
        sortableColumnDefintions={sortableColumnDefinitions}
      />
    </Section>
  );

  function contextMenu(context: MenuContext): React.JSX.Element {
    /* NOW once sorted this 'props.decks[context.getTarget().rows[0]]' is wrong */
    const card: DeckCardListViewmodel = props.cards[context.getTarget().rows[0]];
    // TODO consider allowing increasing over the limit and coloring the value (or row) if too high
    return (
      <Menu>
        <MenuItem
          disabled={props.content != "sideboard" && card.deckQuantity == 4 && !card.cardTypeLine.startsWith("Basic Land")}
          onClick={() => props.onCardIncrease(card)}
          text="Increase Quantity"
        />
        <MenuItem
          disabled={(props.content == "deck" && card.deckQuantity == 1) || (props.content == "sideboard" && card.sideboardQuantity == 1)}
          onClick={() => props.onCardDecrease(card)}
          text="Decrease Quantity"
        />
        <MenuItem
          onClick={() => props.onCardRemove(card)}
          text="Remove"
        />
      </Menu>
    );
  }
  //#endregion
}
