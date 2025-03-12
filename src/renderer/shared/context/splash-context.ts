import { AfterSplashScreenClose } from "../components/base";

export interface ISplashContext {
  hideSplashScreen: (afterClose: Array<AfterSplashScreenClose>) => void;
  showSplashScreen: () => void;
}
