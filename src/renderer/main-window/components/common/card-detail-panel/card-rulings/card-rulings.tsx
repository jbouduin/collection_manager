import { SectionCard } from "@blueprintjs/core";
import * as React from "react";

import { RulingLineDto } from "../../../../../../common/dto";
import { QueryParam, RulingQueryOptions } from "../../../../../../common/ipc-params";
import { RulingLine } from "../ruling-line/ruling-line";
import { CardRulingsProps } from "./card-rulings.props";

export function CardRulings(props: CardRulingsProps) {

  const [rulings, setRulings] = React.useState(null as Array<RulingLineDto>);

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
        .then((queryResult: Array<RulingLineDto>) => setRulings(queryResult));
    } else {
      setRulings(null);
    }
  }, [props.card]);
  //#endregion

  return (rulings?.length > 0 ?
    <SectionCard padded={false}>
      {rulings.map((ruling: RulingLineDto, idx: number) => (<RulingLine className={props.className} ruling={ruling} key={`ruling_${idx}`} isLast={idx == rulings.length - 1} />))}
    </SectionCard> :
    undefined
  );
}
