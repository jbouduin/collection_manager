import { HTMLTable, Intent, Tag } from "@blueprintjs/core";
import * as React from "react";
import { GameFormatDto, LegalityDto } from "../../../../../common/dto";
import { DisplayValueService, DisplayValueServiceContext, GameFormatContext, IpcProxyService, IpcProxyServiceContext } from "../../../context";
import { compareClassNameProp } from "../../utils";
import { LegalitiesViewProps } from "./legalities-view.props";

export const LegalitiesView = React.memo(
  (props: LegalitiesViewProps) => {
    //#region State -------------------------------------------------------------
    const [legalities, setLegalities] = React.useState(new Array<LegalityDto>());
    //#endregion

    //#region Context ---------------------------------------------------------------------
    const displayValueService = React.useContext<DisplayValueService>(DisplayValueServiceContext);
    const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
    //#endregion

    //#region Effects -----------------------------------------------------------
    React.useEffect(
      () => {
        if (props.oracleId) {
          void ipcProxyService.getData(`/oracle/${props.oracleId}/legality`)
            .then(
              (queryResult: Array<LegalityDto>) => setLegalities(queryResult),
              (_r: Error) => setLegalities(new Array<LegalityDto>())
            );
        } else {
          setLegalities(new Array<LegalityDto>());
        }
      },
      [props.oracleId]
    );
    //#endregion

    //#region Main --------------------------------------------------------------
    return (
      <GameFormatContext.Consumer>
        {
          (gameFormats: Array<GameFormatDto>) => (
            <HTMLTable
              bordered={false}
              compact={true}
              width="100%"
            >
              <tbody>
                {
                  getTable(gameFormats)
                }
              </tbody>
            </HTMLTable >
          )
        }
      </GameFormatContext.Consumer>
    );
    //#endregion

    //#region Auxiliary functions -----------------------------------------------
    function getTable(gameFormats: Array<GameFormatDto>): Array<React.JSX.Element> {
      const table = new Array<React.JSX.Element>();
      let currentRow: Array<React.JSX.Element>;
      legalities.forEach((legality: LegalityDto, idx: number) => {
        if (idx % 2 == 0) {
          currentRow = new Array<React.JSX.Element>();
          currentRow.push(<td style={{ paddingLeft: "0px" }}>{gameFormats.find((g: GameFormatDto) => g.id == legality.format)?.display_text || legality.format}</td>);
        } else {
          currentRow.push(<td>{gameFormats.find((g: GameFormatDto) => g.id == legality.format)?.display_text || legality.format}</td>);
        }
        let intent: Intent;
        let label: string = displayValueService.cardLegalityDisplayValues[legality.legality];
        switch (legality.legality) {
          case "banned":
            intent = "danger";
            break;
          case "not_legal":
            intent = "danger";
            break;
          case "legal":
            intent = "success";
            break;
          case "restricted":
            intent = "warning";
            break;
          default:
            intent = "none";
            label = legality.legality;
        }
        currentRow.push(<td style={{ paddingLeft: "0px" }}><Tag fill={true} intent={intent}>{label}</Tag></td>);
        if (idx % 2 == 1) {
          table.push(<tr>{currentRow}</tr>);
        }
      });
      return table;
    }
    //#endregion
  },
  (prev: LegalitiesViewProps, next: LegalitiesViewProps) => {
    return prev.oracleId == next.oracleId && compareClassNameProp(prev.className, next.className);
  }
);
