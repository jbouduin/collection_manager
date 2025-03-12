import { inject, singleton } from "tsyringe";
import { IConfigurationDto } from "../../../../common/dto";
import { IResult, IRouter, RouteCallback, RoutedRequest } from "../../base";
import { INFRASTRUCTURE } from "../../service.tokens";
import { IConfigurationService, IRouterService } from "../interfaces";


@singleton()
export class ConfigurationRouter implements IRouter {
  //#region Private fields ----------------------------------------------------
  private readonly configurationService: IConfigurationService;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(@inject(INFRASTRUCTURE.ConfigurationService) configurationService: IConfigurationService) {
    this.configurationService = configurationService;
  }
  //#endregion

  //#region IRouteDestinationService methods ----------------------------------
  public setRoutes(router: IRouterService): void {
    router.registerGetRoute("/configuration", this.getSettings.bind(this) as RouteCallback);
    router.registerGetRoute("/configuration/factory-defaults", this.getFactoryDefault.bind(this) as RouteCallback);
    router.registerPostRoute("/configuration", this.setSettings.bind(this) as RouteCallback);
    router.registerPutRoute("/configuration", this.putSettings.bind(this) as RouteCallback);
  }
  //#endregion

  //#region Route callbacks ---------------------------------------------------
  private getSettings(_request: RoutedRequest<void>): Promise<IResult<IConfigurationDto>> {
    return this.configurationService.getSettings();
  }

  private getFactoryDefault(_request: RoutedRequest<void>): Promise<IResult<IConfigurationDto>> {
    return this.configurationService.getFactoryDefault();
  }

  private putSettings(request: RoutedRequest<IConfigurationDto>): Promise<IResult<IConfigurationDto>> {
    return this.configurationService.putSettings(request.data);
  }

  private setSettings(request: RoutedRequest<IConfigurationDto>): Promise<IResult<IConfigurationDto>> {
    return this.configurationService.setSettings(request.data);
  }
  //#endregion
}
