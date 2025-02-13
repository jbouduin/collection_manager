import { WebContents } from "electron";

export class RoutedRequest<T> {
  params: Record<string, string>;
  queryParams: Record<string, string>;
  path: string;
  route: string;
  sender: WebContents;
  data: T;
}
