import { HTMLTable, Intent, Tag } from "@blueprintjs/core";
import * as React from "react";
import { LegalityDto } from "../../../../../../common/dto";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../common/context";
import { LegalitiesViewProps } from "./legalities-view.props";


// LATER if token, art_serie, futurue release etc : just display text that this card is not to be used for deck building
export function LegalitiesView(props: LegalitiesViewProps) {
  //#region State -------------------------------------------------------------
  const [legalities, setLegalities] = React.useState(new Array<LegalityDto>());
  //#endregion

  //#region Context ---------------------------------------------------------------------
    const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      if (props.oracleId) {
        void ipcProxyService.getData(`/oracle/${props.oracleId}/legality`)
          .then((queryResult: Array<LegalityDto>) => setLegalities(queryResult));
      } else {
        setLegalities(new Array<LegalityDto>());
      }
    },
    [props.oracleId]
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <HTMLTable
      bordered={false}
      compact={true}
      width="100%"
    >
      <tbody>
        {
          getTable()
        }
      </tbody>
    </HTMLTable >
  );
  //#endregion

  //#region Auxiliary functions -----------------------------------------------
  function getTable(): Array<React.JSX.Element> {
    const table = new Array<React.JSX.Element>();
    let currentRow: Array<React.JSX.Element>;
    legalities.forEach((legality: LegalityDto, idx: number) => {
      if (idx % 2 == 0) {
        currentRow = new Array<React.JSX.Element>();
        currentRow.push(<td style={{ paddingLeft: "0px" }}>{legality.format}</td>);
      } else {
        currentRow.push(<td>{legality.format}</td>);
      }
      let intent: Intent;
      let label: string;
      switch (legality.legality) {
        case "banned":
          intent = "danger";
          label = "Banned";
          break;
        case "not_legal":
          intent = "danger";
          label = "Not legal";
          break;
        case "legal":
          intent = "success";
          label = "Legal";
          break;
        case "restricted":
          intent = "warning";
          label = "Restricted";
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
}
