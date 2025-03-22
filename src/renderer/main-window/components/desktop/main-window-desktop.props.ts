import { Props, ToastProps } from "@blueprintjs/core";


export interface MainWindowDesktopProps extends Props {
  toastCall: (props: ToastProps, key?: string) => void;
}
