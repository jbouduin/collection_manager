import { Card, Section } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import { ConfigurationWrapper } from "../../common/components/configuration/configuration-wrapper/configuration-wrapper";
import { FirstTimeViewProps } from "./first-time-view.props";
import { DisplayValueService, DisplayValueServiceContext, IpcProxyService, IpcProxyServiceContext } from "../../common/context";
import { ConfigurationDto } from "../../../common/dto";
import { noop } from "lodash";

export function FirstTimeView(props: FirstTimeViewProps) {
  //#region Rendering ---------------------------------------------------------
  return (
    <DisplayValueServiceContext.Provider value={new DisplayValueService()}>
      <Card className={classNames(props.className, "desktop-wrapper")} compact={true}>
        <Section compact={true}>
          <IpcProxyServiceContext.Consumer>
            {
              (ipcProxyService: IpcProxyService) => (
                <ConfigurationWrapper
                  configuration={props.configuration}
                  onCancel={() => window.close()}
                  onSave={(toSave: ConfigurationDto) => {
                    void ipcProxyService
                      .postData<ConfigurationDto, ConfigurationDto>("/configuration", toSave)
                      .then(
                        (_saved: ConfigurationDto) => window.close(),
                        noop
                      );
                  }}
                />
              )
            }
          </IpcProxyServiceContext.Consumer>
        </Section>
      </Card>
    </DisplayValueServiceContext.Provider >
  );
  //#endregion
}
