import { IRouterService } from "../../infra/interfaces";

export interface IRouter {
  setRoutes(router: IRouterService): void;
}
