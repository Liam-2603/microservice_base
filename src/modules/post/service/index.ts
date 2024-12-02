import { Inject, Injectable } from "@nestjs/common";
import { AppError, IAuthorRpc, IEventPublisher, Requester } from "src/share";
import { EVENT_PUBLISHER, USER_RPC } from "src/share/di-token";
import { PostCreatedEvent, PostDeletedEvent } from "src/share/event";
import { v7 } from "uuid";
import { CreatePostDTO, createPostDTOSchema, ErrAuthorNotFound, ErrPostNotFound, ErrTopicNotFound, Post, Type, UpdatePostDTO, updatePostDTOSchema } from "../model";
import { POST_REPOSITORY, TOPIC_QUERY } from "../post.di-token";
import { IPostRepository, IPostService, ITopicQueryRPC } from "../post.port";

@Injectable()
export class PostService implements IPostService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly repository: IPostRepository,
    @Inject(TOPIC_QUERY) private readonly topicRPC: ITopicQueryRPC,
    @Inject(USER_RPC) private readonly userRPC: IAuthorRpc,
    @Inject(EVENT_PUBLISHER) private readonly eventPublisher: IEventPublisher,
  ) { }

  async create(dto: CreatePostDTO): Promise<string> {
    const data = createPostDTOSchema.parse(dto);

    const topicExist = await this.topicRPC.findById(data.topicId);

    if (!topicExist) {
      throw AppError.from(ErrTopicNotFound, 404);
    }

    const authorExist = await this.userRPC.findById(data.authorId);

    if (!authorExist) {
      throw AppError.from(ErrAuthorNotFound, 404);
    }

    const newId = v7();
    const post: Post = {
      ...data,
      id: newId,
      isFeatured: false,
      topicId: topicExist.id,
      image: data.image ?? '',
      type: data.image ? Type.MEDIA : Type.TEXT,
      commentCount: 0,
      likedCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.repository.insert(post);

    // publish event
    this.eventPublisher.publish(PostCreatedEvent.create({ postId: newId, topicId: post.topicId }, post.authorId));

    return newId;
  }

  async update(id: string, dto: UpdatePostDTO, requester: Requester): Promise<boolean> {
    const data = updatePostDTOSchema.parse(dto);

    const postExist = await this.repository.get(id);

    if (!postExist) {
      throw AppError.from(ErrPostNotFound, 404);
    }

    if (postExist.authorId !== requester.sub) {
      throw AppError.from(ErrPostNotFound, 404);
    }

    const updateDto: UpdatePostDTO = {
      ...data,
      type: data.image ? Type.MEDIA : Type.TEXT,
      updatedAt: new Date(),
    };

    await this.repository.update(id, updateDto);

    return true;
  }

  async delete(id: string, requester: Requester): Promise<boolean> {
    const postExist = await this.repository.get(id);

    if (!postExist) {
      throw AppError.from(ErrPostNotFound, 404);
    }

    if (postExist.authorId !== requester.sub) {
      throw AppError.from(ErrPostNotFound, 404);
    }

    await this.repository.delete(id);

    // publish event
    this.eventPublisher.publish(PostDeletedEvent.create({ postId: postExist.id, topicId: postExist.topicId }, postExist.authorId));

    return true;
  }
}
