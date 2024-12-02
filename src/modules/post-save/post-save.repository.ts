import { Injectable } from "@nestjs/common";
import prisma from "src/share/components/prisma";
import { Paginated, PagingDTO } from "src/share/data-model";
import { ActionDTO } from "../post-like/post-like.model";
import { PostSave } from "./post-save.model";
import { IPostSaveRepository } from "./post-save.port";

@Injectable()
export class PostSaveRepository implements IPostSaveRepository {
  async get(data: ActionDTO): Promise<PostSave | null> {
    const result = await prisma.postSave.findFirst({ where: data });

    if (!result) return null;

    return {
      userId: result.userId,
      postId: result.postId,
      createdAt: result.createdAt
    };
  }
  async insert(data: PostSave): Promise<boolean> {
    const persistenceData: PostSave = {
      userId: data.userId,
      postId: data.postId,
      createdAt: data.createdAt,
    };

    await prisma.postSave.create({ data: persistenceData });

    return true;
  }
  async delete(data: ActionDTO): Promise<boolean> {
    await prisma.postSave.delete({
      where: {
        postId_userId: {
          postId: data.postId,
          userId: data.userId
        }
      }
    });

    return true;
  }

  async list(userId: string, paging: PagingDTO): Promise<Paginated<PostSave>> {
    const condition = { userId };

    const total = await prisma.postSave.count({ where: condition });

    const skip = (paging.page - 1) * paging.limit;

    const result = await prisma.postSave.findMany({
      where: condition,
      take: paging.limit,
      skip,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      data: result,
      paging: paging,
      total
    };
  }

  async listPostIdsSaved(userId: string, postIds: string[]): Promise<string[]> {
    const result = await prisma.postSave.findMany({ where: { userId, postId: { in: postIds } } });

    return result.map((item) => item.postId);
  }
}