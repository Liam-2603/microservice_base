import { Paginated, Topic } from "src/share/data-model";

import { PagingDTO } from 'src/share/data-model';
import { ActionDTO, PostSave } from './post-save.model';

export interface IPostSaveService {
  save(dto: ActionDTO): Promise<boolean>;
  unsave(dto: ActionDTO): Promise<boolean>;
}

export interface IPostSaveRepository {
  get(data: ActionDTO): Promise<PostSave | null>;
  insert(data: PostSave): Promise<boolean>;
  delete(data: ActionDTO): Promise<boolean>;
  list(userId: string, paging: PagingDTO): Promise<Paginated<PostSave>>;
  listPostIdsSaved(userId: string, postIds: string[]): Promise<string[]>;
}

export interface ITopicQueryRPC {
  findByIds(ids: string[]): Promise<Array<Topic>>;
}
