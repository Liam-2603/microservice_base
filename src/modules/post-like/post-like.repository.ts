import { Injectable } from "@nestjs/common";
import axios from "axios";
import prisma from "src/share/components/prisma";
import { Paginated, PagingDTO } from "src/share/data-model";
import { ActionDTO, PostLike } from "./post-like.model";
import { IPostLikeRepository, IPostQueryRepository } from "./post-like.port";

@Injectable()
export class PostLikeRepository implements IPostLikeRepository {
  async get(data: ActionDTO): Promise<PostLike | null> {
    const result = await prisma.postLike.findFirst({ where: data });
    if (!result) {
      return null;
    }

    return result;
  }

  async insert(data: PostLike): Promise<void> {
    await prisma.postLike.create({ data });
  }

  async delete(data: ActionDTO): Promise<void> {
    await prisma.postLike.delete({
      where: {
        postId_userId: {
          postId: data.postId,
          userId: data.userId
        }
      }
    });
  }

  async list(postId: string, paging: PagingDTO): Promise<Paginated<PostLike>> {
    const total = await prisma.postLike.count({ where: { postId } });

    const skip = (paging.page - 1) * paging.limit;

    const items = await prisma.postLike.findMany({
      where: { postId },
      take: paging.limit,
      skip,
      orderBy: { createdAt: 'desc' }
    });

    return {
      data: items,
      paging,
      total
    };
  }

  async listPostIdsLiked(userId: string, postIds: string[]): Promise<Array<string>> {
    const result = await prisma.postLike.findMany({ where: { userId, postId: { in: postIds } } });
    return result.map((item) => item.postId);
  }
}

@Injectable()
export class PostQueryRPC implements IPostQueryRepository {
  constructor(private readonly postServiceUrl: string) { }

  async existed(postId: string): Promise<boolean> {
    try {
      const { status } = await axios.get(`${this.postServiceUrl}/posts/${postId}`);
      return status === 200;
    } catch (error) {
      return false;
    }
  }
}