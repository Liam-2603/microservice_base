import { Paginated, PagingDTO } from "src/share/data-model";
import { ActionDTO, PostLike } from "./post-like.model";

export interface IPostLikeService {
  like(data: ActionDTO): Promise<boolean>;
  unlike(data: ActionDTO): Promise<boolean>;
}

export interface IPostLikeRepository {
  get(data: ActionDTO): Promise<PostLike | null>;
  insert(data: PostLike): Promise<void>;
  delete(data: ActionDTO): Promise<void>;
  list(postId: string, paging: PagingDTO): Promise<Paginated<PostLike>>;
  listPostIdsLiked(userId: string, postIds: string[]): Promise<Array<string>>;
}

export interface IPostQueryRepository {
  existed(postId: string): Promise<boolean>;
}