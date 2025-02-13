import { DtoConfiguration } from "../../dto/configuration/configuration.dto";
import { PostType } from "./post-type.enum";

export type PostData = DtoConfiguration;

export interface PostParam<T extends object> {
  type: PostType;
  data: T;
}
