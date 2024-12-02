import { Injectable } from "@nestjs/common";
import { Post as PrismaPost } from "@prisma/client";
import prisma from "src/share/components/prisma";
import { Paginated, PagingDTO } from "src/share/data-model";
import { Post, PostCondDTO, Type, UpdatePostDTO } from "../model";
import { IPostRepository } from "../post.port";

@Injectable()
export class PostPrismaRepository implements IPostRepository {
  async get(id: string): Promise<Post | null> {
    const result = await prisma.post.findFirst({ where: { id } });

    if (!result) return null;

    return this._toModel(result);
  }

  async list(cond: PostCondDTO, paging: PagingDTO): Promise<Paginated<Post>> {
    const { str, userId, ...rest } = cond;

    let where = {
      ...rest
    };

    if (userId) {
      where = {
        ...where,
        authorId: userId
      } as PostCondDTO;
    }

    if (str) {
      where = {
        ...where,
        content: { contains: str },
      } as PostCondDTO;
    }

    const total = await prisma.post.count({ where });

    const skip = (paging.page - 1) * paging.limit;

    const result = await prisma.post.findMany({
      where,
      take: paging.limit,
      skip,
      orderBy: {
        id: 'desc'
      }
    });

    return {
      data: result.map(this._toModel),
      paging,
      total
    };
  };

  async insert(data: Post): Promise<void> {
    await prisma.post.create({ data });
  }

  async update(id: string, dto: UpdatePostDTO): Promise<void> {
    await prisma.post.update({ where: { id }, data: dto });
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({ where: { id } });
  }

  async listByIds(ids: string[]): Promise<Post[]> {
    const result = await prisma.post.findMany({ where: { id: { in: ids } } });
    return result.map(this._toModel);
  }

  async increaseCount(id: string, field: string, step: number): Promise<void> {
    await prisma.post.update({ where: { id }, data: { [field]: { increment: step } } });
  }

  async decreaseCount(id: string, field: string, step: number): Promise<void> {
    await prisma.post.update({ where: { id }, data: { [field]: { decrement: step } } });
  }

  private _toModel(data: PrismaPost): Post {
    return {
      ...data,
      image: data.image ?? '',
      isFeatured: data.isFeatured ?? false,
      commentCount: data.commentCount ?? 0,
      likedCount: data.likedCount ?? 0,
      type: data.type as Type,
    } as Post;
  }
}
