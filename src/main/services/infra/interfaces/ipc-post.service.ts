import { PostData, PostParam } from "../../../../common/ipc-params";


export interface IIpcPostService {
  handle(params: PostParam<PostData>): Promise<void>;
}
