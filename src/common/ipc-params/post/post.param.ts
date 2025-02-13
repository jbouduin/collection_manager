import { ConfigurationDto } from "../../dto";
import { PostType } from "./post-type.enum";

export type PostData = ConfigurationDto;

export interface PostParam<T extends object> {
  type: PostType;
  data: T;
}
