import { container, singleton } from "tsyringe";

import { DtoConfiguration } from "../../../../common/dto/configuration/configuration.dto";
import { PostData, PostParam } from "../../../../common/ipc-params";
import INFRATOKENS, { IConfigurationService } from "../interfaces";
import { IIpcPostService } from "../interfaces/ipc-post.service";


@singleton()
export class IpcPostService implements IIpcPostService {

  //#region IIpcPostService methods -------------------------------------------
  public async handle(params: PostParam<PostData>): Promise<void> {
    console.log("start IpcPostService.handling", params);

      switch (params.type) {
        case "Configuration":
          container.resolve<IConfigurationService>(INFRATOKENS.ConfigurationService)
            .saveConfiguration((params as PostParam<DtoConfiguration>).data);
          break;
      }
  }
  //#endregion
}
