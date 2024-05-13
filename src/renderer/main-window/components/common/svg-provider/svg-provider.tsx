
import * as React from "react";
import { SvgProviderProps } from "./svg-provider.props";

export class SvgProvider extends React.PureComponent<SvgProviderProps> {
  public render(): React.ReactNode {

    const start = this.props.svg.indexOf(">");
    const end = this.props.svg.indexOf("</svg");
    const path = this.props.svg.substring(start +1 , end);
    return (
      <span aria-hidden="true" className="bp5-icon bp5-icon-record">
        <svg data-icon="record" height="16" role="img" viewBox="0 0 100 100" width="16" dangerouslySetInnerHTML={{ __html: path }}>
        </svg>
      </span>
    );
  }
}
