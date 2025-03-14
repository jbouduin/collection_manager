import { ScryfallBulkDataType } from "./types";

export interface IScryfallBulkDataItemDto {
  object: "bulk_data";
  id: string;
  type: ScryfallBulkDataType;
  updated_at: string;
  uri: string;
  name: string;
  description: string;
  size: number;
  download_uri: string;
  content_type: string;
  content_encoding: string;
}
