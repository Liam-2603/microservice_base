import { PagingDTO } from "src/share/data-model";

import { Paginated } from "src/share/data-model";
import { Topic, TopicCondDTO, TopicCreationDTO, TopicUpdateDTO } from "./topic.model";

export interface ITopicService {
  create(data: TopicCreationDTO): Promise<string>;
  get(id: string): Promise<Topic>;
  update(id: string, data: TopicUpdateDTO): Promise<void>;
  delete(id: string): Promise<void>;
  list(condition: TopicCondDTO, paging: PagingDTO): Promise<Paginated<Topic>>;
}

export interface ITopicRepository extends ITopicCommandRepository, ITopicQueryRepository {}

export interface ITopicCommandRepository {
  insert(data: Topic): Promise<void>;
  update(id: string, data: TopicUpdateDTO): Promise<void>;
  delete(id: string): Promise<void>;
  increaseTopicCount(id: string, field: string, step: number): Promise<void>;
  decreaseTopicCount(id: string, field: string, step: number): Promise<void>;
}

export interface ITopicQueryRepository {
  findById(id: string): Promise<Topic | null>;
  findByCond(condition: TopicCondDTO): Promise<Topic | null>;
  list(condition: TopicCondDTO, paging: PagingDTO): Promise<Paginated<Topic>>;
  findByIds(ids: string[]): Promise<Topic[]>;
}