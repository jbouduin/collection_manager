import { singleton } from "tsyringe";
import { EUpdateType } from "../../../common";
import { Catalog, Sets } from "scryfall-sdk";
export interface IIpcUpdateService {
  handle(queryType: EUpdateType): void;
}

@singleton()
export class IpcUpdateService implements IIpcUpdateService {

  public async handle(queryType: EUpdateType): Promise<void> {
    console.log('handling query', queryType)
    const supertypes = await Catalog.supertypes();
    console.log(supertypes)
    const sets = await Sets.all();
    console.log(sets);
  }

}
