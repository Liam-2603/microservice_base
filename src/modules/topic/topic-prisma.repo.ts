import { TopicCondDTO } from "./topic.model";

import { Injectable } from "@nestjs/common";
import prisma from "src/share/components/prisma";
import { Paginated, PagingDTO } from "src/share/data-model";
import { Topic, TopicUpdateDTO } from "./topic.model";
import { ITopicRepository } from "./topic.port";

@Injectable()
export class TopicPrismaRepository implements ITopicRepository {
  async insert(data: Topic): Promise<void> {
    await prisma.topic.create({ data });
  }

  async update(id: string, data: TopicUpdateDTO): Promise<void> {
    await prisma.topic.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.topic.delete({ where: { id } });
  }

  async findById(id: string): Promise<Topic | null> {
    const topic = await prisma.topic.findUnique({ where: { id } });
    return topic as Topic;
  }

  async findByCond(condition: TopicCondDTO): Promise<Topic | null> {
    const topic = await prisma.topic.findFirst({ where: condition });
    return topic as Topic;
  }

  async list(condition: TopicCondDTO, paging: PagingDTO): Promise<Paginated<Topic>> {
    const skip = (paging.page - 1) * paging.limit;

    const total = await prisma.topic.count({ where: condition });

    const data = await prisma.topic.findMany({
      where: condition,
      take: paging.limit,
      skip,
      orderBy: {
        id: 'desc'
      }
    });

    return {
      data: data as Topic[],
      paging,
      total
    };
  }

  async increaseTopicCount(id: string, field: string, step: number): Promise<void> {
    await prisma.topic.update({
      where: {
        id
      },
      data: {
        [field]: {
          increment: step
        }
      }
    });
  }

  async decreaseTopicCount(id: string, field: string, step: number): Promise<void> {
    await prisma.topic.update({
      where: {
        id
      },
      data: {
        [field]: {
          decrement: step
        }
      }

    });
  };

  async findByIds(ids: string[]): Promise<Topic[]> {
    const topics = await prisma.topic.findMany({ where: { id: { in: ids } } });
    return topics as Topic[];
  }
}