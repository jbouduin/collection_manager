import { EDesktopView } from "./desktop-view.enum";

export interface DesktopState {
  currentView: EDesktopView;
  settingsDialogOpen: boolean;
  syncDialogOpen: boolean;
  splashScreenOpen: boolean;
}
