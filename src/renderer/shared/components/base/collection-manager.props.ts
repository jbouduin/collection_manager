import { Props } from "@blueprintjs/core";

export type AfterSplashScreenClose = "CardSets" | "CardSymbols";

export interface CollectionManagerProps extends Props {
  hideSplashScreen: (afterClose: Array<AfterSplashScreenClose>) => void;
  showSplashScreen: () => void;
}
