
import { IRouter } from "../../base";
import { IConfigurationService } from "./configuration.service";
import { IRouterService } from "./router.service";
import { IWindowsService } from "./windows.service";

export interface IBootstrapService {
  boot(
    windowsService: IWindowsService,
    rootRouterService: IRouterService,
    routers: Array<IRouter>,
    configurationService: IConfigurationService
  ): Promise<void>;
}
