import * as React from "react";
import { RightPanelProps } from "./right-panel.props";
import { H2, H3 } from "@blueprintjs/core";
import { IDeckDetailsDto } from "../../../../../../../common/dto";
import { IpcProxyService, IpcProxyServiceContext } from "../../../../../../shared/context";

export function RightPanel(props: RightPanelProps) {
  const [deck, setDeck] = React.useState<IDeckDetailsDto>(undefined);

  //#region Context -----------------------------------------------------------
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      if (props.selectedDeckId != null) {
        void ipcProxyService.getData<IDeckDetailsDto>(`/deck/${props.selectedDeckId}`)
          .then(
            (dto: IDeckDetailsDto) => setDeck(dto),
            (_r: Error) => setDeck(null)
          );
      } else {
        setDeck(null);
      }
    },
    [props.selectedDeckId]
  );
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <>
      {
        deck &&
        <H2>{deck.name}</H2>
      }
      {
        !deck &&
        <H3>Select a deck to view details</H3>
      }
    </>
  );
  //#endregion
}
