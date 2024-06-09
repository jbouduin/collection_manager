import { CardSetViewmodel } from "../../viewmodels";
import { EDesktopView } from "./desktop-view.enum";

export interface DesktopState {
  currentView: EDesktopView;
  cardSetDialogOpen: boolean;
  settingsDialogOpen: boolean;
  syncDialogOpen: boolean;
  splashScreenOpen: boolean;
  cardSet?: CardSetViewmodel;
}
