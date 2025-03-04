import { Classes, SectionCard } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import { RulingLineDto } from "../../../../../../common/dto";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../shared/context";
import { CardRulingsViewProps } from "./card-rulings-view.props";
import { compareClassNameProp } from "../../../../../shared/components";

export const CardRulingsView = React.memo(
  (props: CardRulingsViewProps) => {
    //#region State -------------------------------------------------------------
    const [rulings, setRulings] = React.useState<Array<RulingLineDto>>(null);
    //#endregion

    //#region Context ---------------------------------------------------------------------
    const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
    //#endregion

    //#region Effects -----------------------------------------------------------
    React.useEffect(
      () => {
        if (props.oracleId) {
          void ipcProxyService.getData(`/oracle/${props.oracleId}/ruling`)
            .then(
              (queryResult: Array<RulingLineDto>) => setRulings(queryResult),
              (_r: Error) => setRulings(null)
            );
        } else {
          setRulings(null);
        }
      },
      [props.oracleId]
    );
    //#endregion

    //#region Rendering ---------------------------------------------------------
    return rulings?.length > 0
      ? renderSectionCard(rulings)
      : undefined;

    function renderSectionCard(rulings: Array<RulingLineDto>): React.JSX.Element {
      return (
        <SectionCard padded={false}>
          {
            rulings.map((ruling: RulingLineDto, idx: number) => renderSingleRulingLine(idx, ruling, idx == rulings.length - 1))
          }
        </SectionCard>
      );
    }

    function renderSingleRulingLine(idx: number, ruling: RulingLineDto, isLast: boolean): React.JSX.Element {
      return (
        <div key={`r-${idx}`}>
          <p>{ruling.published_at.toLocaleDateString(navigator.language, { day: "2-digit", month: "2-digit", year: "numeric" })} - {ruling.source}</p>
          <p className={Classes.RUNNING_TEXT}>{ruling.comments}</p>
          {
            !isLast &&
            <p className={classNames("bp5-divider", "ruling-divider")} />
          }
        </div>
      );
    }
    //#endregion
  },
  (prev: CardRulingsViewProps, next: CardRulingsViewProps) => {
    return prev.oracleId == next.oracleId && compareClassNameProp(prev.className, next.className);
  }
);
