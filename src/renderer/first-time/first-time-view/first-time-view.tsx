import { Card, Section } from "@blueprintjs/core";
import classNames from "classnames";
import { noop } from "lodash";
import * as React from "react";
import { IConfigurationDto } from "../../../common/dto";
import { ConfigurationWrapper } from "../../shared/components/configuration";
import { DisplayValueService, DisplayValueServiceContext, IpcProxyService, IpcProxyServiceContext } from "../../shared/context";
import { FirstTimeViewProps } from "./first-time-view.props";

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
                  onSave={(toSave: IConfigurationDto) => {
                    void ipcProxyService
                      .postData<IConfigurationDto, IConfigurationDto>("/configuration", toSave)
                      .then(
                        (_saved: IConfigurationDto) => window.close(),
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
