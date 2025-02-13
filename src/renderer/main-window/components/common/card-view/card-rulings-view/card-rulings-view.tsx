import { Classes, SectionCard } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import { DtoRulingLine } from "../../../../../../common/dto";
import { QueryParam, RulingQueryOptions } from "../../../../../../common/ipc-params";
import { CardRulingsViewProps } from "./card-rulings-view.props";

export function CardRulingsView(props: CardRulingsViewProps) {
  //#region State -------------------------------------------------------------
  const [rulings, setRulings] = React.useState(null as Array<DtoRulingLine>);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      if (props.card) {
        const rulingQueryParam: QueryParam<RulingQueryOptions> = {
          type: "Ruling",
          options: {
            cardId: props.card.cardId
          }
        };
        void window.ipc.query(rulingQueryParam)
          .then((queryResult: Array<DtoRulingLine>) => setRulings(queryResult));
      } else {
        setRulings(null);
      }
    },
    [props.card]
  );
  //#endregion

  //#region Main --------------------------------------------------------------
  return rulings?.length > 0
    ? renderSectionCard(rulings)
    : undefined;
  //#endregion

  //#region Rendering methods -------------------------------------------------
  function renderSectionCard(rulings: Array<DtoRulingLine>): React.JSX.Element {
    return (
      <SectionCard padded={false}>
        {
          rulings.map((ruling: DtoRulingLine, idx: number) => renderSingleRulingLine(idx, ruling, idx == rulings.length - 1))
        }
      </SectionCard>
    );
  }

  function renderSingleRulingLine(idx: number, ruling: DtoRulingLine, isLast: boolean): React.JSX.Element {
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
}
