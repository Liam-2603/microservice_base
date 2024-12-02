import { Paginated, PagingDTO } from "src/share";
import { Follow, FollowCondDTO, FollowDTO, Follower } from "./following.model";

export interface IFollowingService {
  follow(follow: FollowDTO): Promise<boolean>;
  hasFollowed(followerId: string, followingId: string): Promise<boolean>;
  unfollow(follow: FollowDTO): Promise<boolean>;
  listFollowers(userId: string, paging: PagingDTO): Promise<Paginated<Follower>>;
  listFollowings(userId: string, paging: PagingDTO): Promise<Paginated<Follower>>;
}

export interface IFollowingRepository {
  insert(follow: Follow): Promise<boolean>;
  delete(follow: FollowDTO): Promise<boolean>;
  find(cond: FollowDTO): Promise<Follow | null>;

  whoAmIFollowing(meId: string, ids: string[]): Promise<Follow[]>;
  list(cond: FollowCondDTO, paging: PagingDTO): Promise<Paginated<Follow>>;
}