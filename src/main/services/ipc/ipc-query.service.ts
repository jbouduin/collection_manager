import { singleton } from "tsyringe";
import { EQueryType } from "../../../common";

export interface IIpcQueryService {
  handle(queryType: EQueryType): void;
}

@singleton()
export class IpcQueryService implements IIpcQueryService {
  public handle(queryType: EQueryType): void {
    console.log('handling query', queryType)
  }
}
