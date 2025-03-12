import { ToastProps } from "@blueprintjs/core";

export interface IToastContext {
  showToast: (props: ToastProps, key?: string) => void;
}
