import { Injectable } from "@nestjs/common";
import { Paginated, PagingDTO } from "src/share";
import prisma from "src/share/components/prisma";
import { Follow, FollowCondDTO, FollowDTO } from "./following.model";
import { IFollowingRepository } from "./following.port";

@Injectable()
export class FollowingRepository implements IFollowingRepository {
  async insert(follow: Follow): Promise<boolean> {
    await prisma.follower.create({
      data: follow
    });

    return true;
  }

  async delete(follow: FollowDTO): Promise<boolean> {
    await prisma.follower.delete({
      where: {
        followingId_followerId: {
          followerId: follow.followerId,
          followingId: follow.followingId
        }
      }
    });

    return true;
  }

  async find(cond: FollowDTO): Promise<Follow | null> {
    const result = await prisma.follower.findFirst({
      where: cond
    });

    return result;
  }

  async whoAmIFollowing(followingId: string, ids: string[]): Promise<Follow[]> {
    const result = await prisma.follower.findMany({
      where: {
        followingId: {
          in: ids
        },
        followerId: followingId
      }
    });

    return result;
  }

  async list(cond: FollowCondDTO, paging: PagingDTO): Promise<Paginated<Follow>> {
    const count = await prisma.follower.count({
      where: cond
    });

    const skip = (paging.page - 1) * paging.limit;
    const result = await prisma.follower.findMany({
      where: cond,
      skip,
      take: paging.limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      data: result,
      paging,
      total: count
    };
  }
}
