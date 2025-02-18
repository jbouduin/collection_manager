import { Cell, CellRenderer, Column, ColumnProps } from "@blueprintjs/table";
import * as React from "react";
import { MtgCardListDto, LanguageDto } from "../../../../../../../common/dto";
import { MTGLanguage } from "../../../../../../../common/types";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../../common/context";
import { BaseCardsTableView } from "../../../../../components/common/base-cards-table-view/base-cards-table-view";
import { cardSetNameRenderer, symbolRenderer, textCellRenderer } from "../../../../../components/common/base-cards-table-view/cell-renderers";
import { LanguagesContext } from "../../../../../components/context";
import { CardSetViewmodel, MtgCardListViewmodel } from "../../../../../viewmodels";
import { CenterPanelProps } from "./center-panel.props";


export function CenterPanel(props: CenterPanelProps) {
  //#region State -------------------------------------------------------------
  const [cards, setCards] = React.useState(new Array<MtgCardListViewmodel>());
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
          .then((cardResult: Array<MtgCardListDto>) => {
            setCards(cardResult
              .map((card: MtgCardListDto) => new MtgCardListViewmodel(card))
              .sort((a: MtgCardListViewmodel, b: MtgCardListViewmodel) => a.collectorNumberSortValue.localeCompare(b.collectorNumberSortValue)));
          });
      } else {
        setCards(new Array<MtgCardListViewmodel>());
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
          <BaseCardsTableView<MtgCardListViewmodel>
            columnDefinitions={getColumnDefinitions(languages)}
            data={cards}
            onCardsSelected={(cards?: Array<MtgCardListViewmodel>) => props.onCardsSelected(cards)}
          />
        )
      }
    </LanguagesContext.Consumer>
  );
  //#endregion

  function getColumnDefinitions(languages: Array<LanguageDto>): Array<React.ReactElement<ColumnProps>> {
    const result = new Array<React.ReactElement<ColumnProps>>();
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: MtgCardListViewmodel) => card.collectorNumber)} key="Number" name="Number" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: MtgCardListViewmodel) => card.rarity)} key="Rarity" name="Rarity" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: MtgCardListViewmodel) => card.cardName)} key="Name" name="Name" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: MtgCardListViewmodel) => card.cardTypeLine)} key="Type" name="Type" />);
    result.push(<Column cellRenderer={symbolRenderer(cards, (card: MtgCardListViewmodel) => card.cardManacost)} key="Mana cost" name="ManaCost" />);
    result.push(<Column cellRenderer={cardSetNameRenderer(cards, props.selectedSets, (card: MtgCardListViewmodel) => card.setId)} key="Set" name="Set" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: MtgCardListViewmodel) => card.cardPower)} key="Power" name="Power" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: MtgCardListViewmodel) => card.cardThoughness)} key="Thoughness" name="Thoughness" />);
    result.push(<Column cellRenderer={symbolRenderer(cards, (card: MtgCardListViewmodel) => card.colorIdentity)} key="CI" name="CI" />);
    result.push(<Column cellRenderer={languageRenderer(languages, (card: MtgCardListViewmodel) => card.languages)} key="Languages" name="Languages" />);
    return result;
  }

  function languageRenderer(languages: Array<LanguageDto>, valueCallBack: (card: MtgCardListViewmodel) => Array<string>): CellRenderer {
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
