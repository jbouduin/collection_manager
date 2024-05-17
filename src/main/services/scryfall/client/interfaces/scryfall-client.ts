import { CatalogType } from "../../../../../common/enums";
import { ScryfallCatalog } from "../../types";

export interface IScryfallClient {
  fetchSvg(uri: string): Promise<ArrayBuffer>;
  fetchImage(uri: string): Promise<ReadableStream<Uint8Array>>;
  getCatalog(type: CatalogType): Promise<ScryfallCatalog>;
}
