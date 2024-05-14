
import * as React from "react";
import { SvgProviderProps } from "./svg-provider.props";

export class SvgProvider extends React.PureComponent<SvgProviderProps> {
  public render(): React.ReactNode {
    const start = this.props.svg.indexOf(">");
    const end = this.props.svg.indexOf("</svg");
    let  path = this.props.svg.substring(start + 1, end);

    return (
      <span aria-hidden="true" className="bp5-icon bp5-icon-record">
        <svg
          className={this.props.className}
          role="img"
          viewBox="0 0 100 100"
          height={this.props.height ?? 16}
          width={this.props.width ?? 16}
          dangerouslySetInnerHTML={{ __html: path }}>
        </svg>
      </span>
    );
  }
}
