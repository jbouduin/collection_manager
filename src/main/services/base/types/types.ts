import { IResult } from "./result";
import { RoutedRequest } from "./routed-request";

export type RouteCallback = (request: RoutedRequest<unknown>) => Promise<IResult<unknown>>;
export type DeleteRouteCallback = (request: RoutedRequest<unknown>) => Promise<IResult<number>>;
export type LogSource = "Main" | "Renderer"; // TODO add "Sync" , eventually add "DB"
