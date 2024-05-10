import * as React from "react";
import { CardsTableState } from "./cards-table.state";
import { Props } from "@blueprintjs/core";
import { CardSelectDto, SymbologySelectDto } from "../../../../common/dto";
import { Cell, CellProps, CellRenderer, Column, Table2 } from "@blueprintjs/table";
import { CardQueryOptions, IQueryOrSyncParam } from "../../../..//common/ipc-params";


export class CardsTable extends React.PureComponent<Props, CardsTableState> {

  // LATER add to context ?
  private allSymbologies: Map<string,string>;

  public constructor(props: Props) {
    super(props);
    this.state = { cards: new Array<CardSelectDto>() };

    this.allSymbologies = new Map<string, string>();
  }

  public render(): React.JSX.Element {
    return (
      <div>
        <Table2 numRows={this.state?.cards?.length ?? 0}>
          <Column name="Name" cellRenderer={this.textCellRenderer((card: CardSelectDto) => card.name)} />
          <Column name="Rarity" cellRenderer={this.textCellRenderer((card: CardSelectDto) => card.rarity)} />
          <Column name="Mana cost" cellRenderer={this.manaCostRenderer.bind(this)} />
          <Column name="Power" cellRenderer={this.textCellRenderer((card: CardSelectDto) => card.power)} />
          <Column name="Thoughness" cellRenderer={this.textCellRenderer((card: CardSelectDto) => card.thoughness)} />
        </Table2>
      </div>
    );
  }

  componentDidMount(): void {
    const symbologyQueryParam: IQueryOrSyncParam<null> = {
      type: "Symbology",
      options: null
    };
    window.ipc.query(symbologyQueryParam).then((symbolyResult: Array<SymbologySelectDto>) => {

      symbolyResult.forEach((symbology: SymbologySelectDto) => this.allSymbologies.set(symbology.symbology.id, symbology.symbology.svg_uri));
      const cardQueryParam: IQueryOrSyncParam<CardQueryOptions> = {
        type: "Card",
        options: {
          cardId: null,
          setIds: ["44f17b37-dcf8-4239-baab-1efc00cd3480"]
        }
      };
      window.ipc.query(cardQueryParam)
        .then((cardResult: Array<CardSelectDto>) => { console.log(cardResult); this.setState({ cards: cardResult }); });
    });
  }
  //#region Cell renderers --------------------------------
  private textCellRenderer(valueCallBack: (card: CardSelectDto) => string): CellRenderer {
    return (row: number) => (<Cell>{valueCallBack(this.state.cards[row])}</Cell>);
  }

  private manaCostRenderer(row: number): React.ReactElement<CellProps> {
    const cellValue = this.state.cards[row].mana_cost;

    let splittedCellValue: Array<string>;
    if (cellValue?.length > 0) {
      splittedCellValue = cellValue.split("}");
      splittedCellValue.pop();
      splittedCellValue = splittedCellValue.map((s: string, i: number) => {
        const r = i < splittedCellValue.length ? s + "}" : s;
        return this.allSymbologies.get(r);
      });
    } else {
      splittedCellValue = new Array<string>();
    }

    return (<Cell>{splittedCellValue.join(" + ")}</Cell>);
  }
  //#endregion
}
