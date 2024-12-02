import { Inject, Injectable } from "@nestjs/common";
import { AppError } from "src/share/app-error";
import { Paginated, PagingDTO } from "src/share/data-model";
import { v7 } from "uuid";
import { TOPIC_REPOSITORY } from "./token.di-token";
import { ErrTopicNameAlreadyExists, ErrTopicNotFound, Topic, TopicCondDTO, topicCondDTOSchema, TopicCreationDTO, topicCreationDTOSchema, TopicUpdateDTO } from "./topic.model";
import { ITopicRepository, ITopicService } from "./topic.port";

@Injectable()
export class TopicService implements ITopicService {
  constructor(@Inject(TOPIC_REPOSITORY) private readonly topicRepo: ITopicRepository) {}

  async create(dto: TopicCreationDTO): Promise<string> {
    const data = topicCreationDTOSchema.parse(dto);

    const topicExist = await this.topicRepo.findByCond({ name: data.name });

    if (topicExist) {
      throw AppError.from(ErrTopicNameAlreadyExists, 400);
    }

    const newId = v7();
    const topic: Topic = {
      id: newId,
      name: data.name,
      postCount: 0,
      color: data.color,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.topicRepo.insert(topic);

    return newId;
  }

  async get(id: string): Promise<Topic> {
    const topic = await this.topicRepo.findById(id);
    if (!topic) {
      throw AppError.from(ErrTopicNotFound, 404);
    }
    return topic;
  }

  async update(id: string, data: TopicUpdateDTO): Promise<void> {
    const topicExist = await this.topicRepo.findById(id);

    if (!topicExist) {
      throw AppError.from(ErrTopicNotFound, 404);
    }

    await this.topicRepo.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const topic = await this.topicRepo.findById(id);
    if (!topic) {
      throw AppError.from(ErrTopicNotFound, 404);
    }

    await this.topicRepo.delete(id);
  }

  async list(condition: TopicCondDTO, paging: PagingDTO): Promise<Paginated<Topic>> {
    const dto = topicCondDTOSchema.parse(condition);
    return await this.topicRepo.list(dto, paging);
  }
}
