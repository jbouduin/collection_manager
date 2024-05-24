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
              const cachedSvg = props.cachedSvg.get(manaCost);
              if (cachedSvg) {
                return (<SvgProvider className="mana-cost-image" svg={props.cachedSvg.get(manaCost)} key={`manacost_${idx}`} />);
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
