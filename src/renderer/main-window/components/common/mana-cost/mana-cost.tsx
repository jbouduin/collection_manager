import * as React from "react";

import { ManaCostProps } from "./mana-cost.props";
import { SvgProvider } from "../svg-provider/svg-provider";

export function ManaCost(props: ManaCostProps) {
  return (
    <div>
      {
        props.manacost
          .map((manaCost: string, idx: number) => {
            if (manaCost == "//") {
              return (<span>&nbsp; &nbsp;//&nbsp;&nbsp;</span>);
            } else {
              const symbolSvg = props.symbolSvgs.get(manaCost);
              if (symbolSvg) {
                return (<SvgProvider className="mana-cost-image" svg={props.symbolSvgs.get(manaCost)} key={`manacost_${idx}`} />);
              } else {
                console.log(`no cached svg for "${manaCost}"`);
                return;
              }
            }
          })
      }
    </div >
  );
}
