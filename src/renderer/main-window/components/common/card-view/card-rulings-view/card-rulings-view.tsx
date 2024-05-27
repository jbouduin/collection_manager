import { SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { DtoRulingLine } from "../../../../../../common/dto";
import { QueryParam, RulingQueryOptions } from "../../../../../../common/ipc-params";
import { RulingLineView } from "../ruling-line-view/ruling-line-view";
import { CardRulingsViewProps } from "./card-rulings-view.props";

export function CardRulingsView(props: CardRulingsViewProps) {

  //#region State -------------------------------------------------------------
  const [rulings, setRulings] = React.useState(null as Array<DtoRulingLine>);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(() => {
    if (props.card) {
      const rulingQueryParam: QueryParam<RulingQueryOptions> = {
        type: "Ruling",
        options: {
          cardId: props.card.cardId
        }
      };
      window.ipc.query(rulingQueryParam)
        .then((queryResult: Array<DtoRulingLine>) => setRulings(queryResult));
    } else {
      setRulings(null);
    }
  }, [props.card]);
  //#endregion

  //#region Main --------------------------------------------------------------
  return (rulings?.length > 0 ?
    <SectionCard padded={false}>
      {
        rulings.map((ruling: DtoRulingLine, idx: number) =>
          (<RulingLineView className={props.className} ruling={ruling} key={`ruling_${idx}`} isLast={idx == rulings.length - 1} />)
        )
      }
    </SectionCard> :
    undefined
  );
  //#endregion
}
