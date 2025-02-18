import { Cell, CellRenderer, Column, ColumnProps } from "@blueprintjs/table";
import * as React from "react";
import { CollectionCardDto, LanguageDto } from "../../../../../../../common/dto";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../../common/context";
import { BaseCardsTableView } from "../../../../../components/common/base-cards-table-view/base-cards-table-view";
import { symbolRenderer, textCellRenderer } from "../../../../../components/common/base-cards-table-view/cell-renderers";
import { LanguagesContext } from "../../../../../components/context";
import { CollectionCardListViewmodel } from "../../../../../viewmodels";
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
        ipcProxyService
          .getData<Array<CollectionCardDto>>(`/collection/${props.selectedCollection.id}/cards`)
          .then(
            (r: Array<CollectionCardDto>) => setCards(r.map((c: CollectionCardDto) => new CollectionCardListViewmodel(c))),
            (_r: Array<CollectionCardDto>) => setCards(new Array<CollectionCardListViewmodel>())
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
          <BaseCardsTableView<CollectionCardListViewmodel>
            columnDefinitions={getColumnDefinitions(languages)}
            data={cards}
            onCardsSelected={(cards?: Array<CollectionCardListViewmodel>) => props.onCardsSelected(cards)}
          />
        )
      }
    </LanguagesContext.Consumer>
  );
  //#endregion

  function getColumnDefinitions(languages: Array<LanguageDto>): Array<React.ReactElement<ColumnProps>> {
    const result = new Array<React.ReactElement<ColumnProps>>();
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.setName)} key="Set" name="Set" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.rarity)} key="Rarity" name="Rarity" />);
    result.push(<Column cellRenderer={languageRenderer(languages, (card: CollectionCardListViewmodel) => card.language)} key="Language" name="Language" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.cardName)} key="Name" name="Name" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.cardTypeLine)} key="Type" name="Type" />);
    result.push(<Column cellRenderer={symbolRenderer(cards, (card: CollectionCardListViewmodel) => card.cardManacost)} key="Mana cost" name="ManaCost" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.cardPower)} key="Power" name="Power" />);
    result.push(<Column cellRenderer={textCellRenderer(cards, (card: CollectionCardListViewmodel) => card.cardThoughness)} key="Thoughness" name="Thoughness" />);
    result.push(<Column cellRenderer={symbolRenderer(cards, (card: CollectionCardListViewmodel) => card.colorIdentity)} key="CI" name="CI" />);

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
}
