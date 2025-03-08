import React from "react";
import { ConfigurationDto } from "../../../../common/dto";
import { BaseDesktop, DesktopContentProps } from "../../../shared/components/base";
import { ButtonBar } from "./button-bar/button-bar";
import { EDesktopView } from "./desktop-view.enum";
import { CollectionView } from "./views/collection-view/collection-view";
import { DeckView } from "./views/deck-view/deck-view";
import { MtgView } from "./views/mtg-view/mtg-view";


export function MainWindowDesktop() {
  //#region State -------------------------------------------------------------
  const [desktopView, setDesktopView] = React.useState<EDesktopView>(EDesktopView.Database);
  //#endregion

  //#region rendering ---------------------------------------------------------
  return (
    <BaseDesktop
      desktopContent={(props: DesktopContentProps) => desktopContent(props)}
    />
  );

  function desktopContent(contentProps: DesktopContentProps): React.JSX.Element {
    return (
      <>
        <ButtonBar
          {...contentProps}
          afterSaveSettings={(saved: ConfigurationDto) => contentProps.onConfigurationChanged(saved)}
          currentView={desktopView}
          onDesktopViewSelectionClick={(view: EDesktopView) => setDesktopView(view)}
        />
        <div className="main-panel">
          {
            desktopView == EDesktopView.Database &&
            <MtgView {...contentProps} />
          }
          {
            desktopView == EDesktopView.Collection &&
            <CollectionView {...contentProps} />
          }
          {
            desktopView == EDesktopView.Deck &&
            <DeckView {...contentProps} />
          }
        </div>
      </>
    );
  }
  //#endregion
}
