import { ToastProps } from "@blueprintjs/core";
import { AfterSplashScreenClose } from "./types";


export interface IOverlayContext {
  hideSplashScreen: (afterClose: Array<AfterSplashScreenClose>) => void;
  showSplashScreen: () => void;
  showToast: (props: ToastProps, key?: string) => void;
}
