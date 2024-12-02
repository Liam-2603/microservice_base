import { Controller, Inject } from "@nestjs/common";
import { RedisClient } from "src/share/components";
import { EvtPostCommentDeleted, EvtPostCommented, EvtPostLiked, EvtPostUnliked, PostCommentDeletedEvent, PostCommentedEvent, PostLikedEvent, PostUnlikedEvent } from "src/share/event";
import { POST_REPOSITORY } from "../post.di-token";
import { IPostRepository } from "../post.port";

@Controller()
export class PostConsumerController {
  constructor(
    @Inject(POST_REPOSITORY) private readonly repo: IPostRepository,
  ) {
    this.subscribe();
  }

  async handlePostLiked(evt: PostLikedEvent) {
    this.repo.increaseCount(evt.payload.postId, "likedCount", 1);
  }

  async handlePostUnliked(evt: PostUnlikedEvent) {
    this.repo.decreaseCount(evt.payload.postId, "likedCount", 1);
  }

  async handlePostComment(evt: PostCommentedEvent) {
    this.repo.increaseCount(evt.payload.postId, "commentCount", 1);
  }

  async handlePostUncomment(evt: PostCommentDeletedEvent) {
    this.repo.decreaseCount(evt.payload.postId, "commentCount", 1);
  }

  subscribe() {
    RedisClient.getInstance().subscribe(EvtPostLiked, (msg: string) => {
      const data = JSON.parse(msg);
      const evt = PostLikedEvent.from(data);
      this.handlePostLiked(evt);
    });

    RedisClient.getInstance().subscribe(EvtPostUnliked, (msg: string) => {
      const data = JSON.parse(msg);
      const evt = PostUnlikedEvent.from(data);
      this.handlePostUnliked(evt);
    });

    RedisClient.getInstance().subscribe(EvtPostCommented, (msg: string) => {
      const data = JSON.parse(msg);
      const evt = PostCommentedEvent.from(data);
      this.handlePostComment(evt);
    });

    RedisClient.getInstance().subscribe(EvtPostCommentDeleted, (msg: string) => {
      const data = JSON.parse(msg);
      const evt = PostCommentDeletedEvent.from(data);
      this.handlePostUncomment(evt);
    });
  }
}