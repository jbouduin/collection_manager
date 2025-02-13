import { container, singleton } from "tsyringe";

import { ConfigurationDto } from "../../../../common/dto/infra/configuration.dto";
import { PostData, PostParam } from "../../../../common/ipc-params";
import { IConfigurationService } from "../interfaces";
import { IIpcPostService } from "../interfaces/ipc-post.service";
import { INFRASTRUCTURE } from "../../service.tokens";


@singleton()
export class IpcPostService implements IIpcPostService {

  //#region IIpcPostService methods -------------------------------------------
  public async handle(params: PostParam<PostData>): Promise<void> {
    switch (params.type) {
      case "Configuration":
        container.resolve<IConfigurationService>(INFRASTRUCTURE.ConfigurationService)
          .setSettings((params as PostParam<ConfigurationDto>).data);
        break;
    }
  }
  //#endregion
}
