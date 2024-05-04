import { QueryType } from "../../../../common/enums";

export interface IIpcQueryService {
  handle(queryType: QueryType): void;
}
