import { AlertProps, ToastProps } from "@blueprintjs/core";
import { AfterSplashScreenClose } from "./types";


export interface IOverlayContext {
  hideAlert: () => void;
  hideSplashScreen: (afterClose: Array<AfterSplashScreenClose>) => void;
  showAlert: (alertProps: AlertProps) => void;
  showSplashScreen: () => void;
  showToast: (props: ToastProps, key?: string) => void;
}
