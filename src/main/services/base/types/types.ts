import { IResult } from "./result";
import { RoutedRequest } from "./routed-request";

export type RouteCallback = (request: RoutedRequest<unknown>) => Promise<IResult<unknown>>;
export type LogSource = "Main" | "Renderer";
