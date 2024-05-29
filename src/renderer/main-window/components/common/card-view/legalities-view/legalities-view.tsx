import { Intent, Tag } from "@blueprintjs/core";
import * as React from "react";

import { LegalityQueryOptions, QueryParam } from "../../../../../../common/ipc-params";
import { DtoLegality } from "../../../../../../common/dto";
import { LegalitiesViewProps } from "./legalities-view.props";

export function LegalitiesView(props: LegalitiesViewProps) {

  // LATER if token, art_serie etc : just display text that this card is not to be used for deck building
  //#region State -------------------------------------------------------------
  const [legalities, setLegalities] = React.useState(new Array<DtoLegality>());
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      if (props.oracleId) {
        const rulingQueryParam: QueryParam<LegalityQueryOptions> = {
          type: "Legality",
          options: {
            oracleId: props.oracleId
          }
        };
        window.ipc.query(rulingQueryParam)
          .then((queryResult: Array<DtoLegality>) => setLegalities(queryResult));
      } else {
        setLegalities(new Array<DtoLegality>());
      }
    },
    [props.oracleId]
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <table className="bp5-html-table .bp5-compact">
      <tbody>
        {
          getTable()
        }
      </tbody>
    </table >
  );
  //#endregion

  //#region Auxiliary functions -----------------------------------------------
  function getTable(): Array<React.JSX.Element> {
    const table = new Array<React.JSX.Element>();
    let currentRow: Array<React.JSX.Element>;
    legalities.forEach((legality: DtoLegality, idx: number) => {
      if (idx % 2 == 0) {
        currentRow = new Array<React.JSX.Element>();
      }
      currentRow.push(<td>{legality.format}</td>);
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
      currentRow.push(<td><Tag fill={true} intent={intent}>{label}</Tag></td>);
      if (idx % 2 == 1) {
        table.push(<tr>{currentRow}</tr>);
      }
    });
    return table;
  }
  //#endregion
}
