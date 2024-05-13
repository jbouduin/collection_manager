import { Props } from "@blueprintjs/core";
import { Cell, CellProps, CellRenderer, Column, Table2 } from "@blueprintjs/table";
import * as React from "react";

import { CardSelectDto } from "../../../../../common/dto";
import { CardQueryOptions, IQueryOrSyncParam } from "../../../../../common/ipc-params";
import { SvgProvider } from "../svg-provider/svg-provider";
import { CardsTableState } from "./cards-table.state";


export class CardsTable extends React.PureComponent<Props, CardsTableState> {

  //#region private properties ------------------------------------------------
  // LATER add to context ?
  private cachedSvgs: Map<string, string>;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(props: Props) {
    super(props);
    this.state = { cards: new Array<CardSelectDto>() };
  }

  public componentDidMount(): void {
    const symbologyQueryParam: IQueryOrSyncParam<null> = {
      type: "SymbologyCachedSvg",
      options: null
    };
    window.ipc.query(symbologyQueryParam).then((cachedSvgs: Map<string, string>) => {
      this.cachedSvgs = cachedSvgs;
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
  //#endregion

  //#region public methods ----------------------------------------------------
  public render(): React.JSX.Element {
    return (
      <div className="cards-table-wrapper">
        <Table2 numRows={this.state?.cards?.length ?? 0}>
          <Column name="Name" cellRenderer={this.textCellRenderer((card: CardSelectDto) => card.card.name)} />
          <Column name="Rarity" cellRenderer={this.textCellRenderer((card: CardSelectDto) => card.card.rarity)} />
          <Column name="Mana cost" cellRenderer={this.manaCostRenderer.bind(this)} />
          <Column name="Power" cellRenderer={this.textCellRenderer((card: CardSelectDto) => card.card.power)} />
          <Column name="Thoughness" cellRenderer={this.textCellRenderer((card: CardSelectDto) => card.card.thoughness)} />
        </Table2>
      </div>
    );
  }
  //#endregion

  //#region Cell renderers --------------------------------
  private textCellRenderer(valueCallBack: (card: CardSelectDto) => string): CellRenderer {
    return (row: number) => (<Cell>{valueCallBack(this.state.cards[row])}</Cell>);
  }

  private manaCostRenderer(row: number): React.ReactElement<CellProps> {
    return (
      <Cell>
        {
          this.state.cards[row].manaCostArray.map((manaCost: string) => {
            return <SvgProvider {...this.props} svg={this.cachedSvgs.get(manaCost)} />;
          })
        }
      </Cell>
    );
  }
  //#endregion
}
