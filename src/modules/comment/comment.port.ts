import { Paginated, PagingDTO } from "src/share/data-model";
import { Requester } from "src/share/interface";
import { Comment, CommentCondDTO, CommentCreateDTO, CommentUpdateDTO } from "./model";

export interface ICommentRepository extends ICommentQueryRepository, ICommentCommandRepository {}

export interface ICommentService {
  create(dto: CommentCreateDTO): Promise<string>;
  update(id: string, requester: Requester, dto: CommentUpdateDTO): Promise<boolean>;
  delete(id: string, requester: Requester): Promise<boolean>;
  findById(id: string): Promise<Comment | null>;
  list(dto: CommentCondDTO, paging: PagingDTO): Promise<Paginated<Comment>>;
}

export interface ICommentQueryRepository {
  findById(id: string): Promise<Comment | null>;
  list(dto: CommentCondDTO, paging: PagingDTO): Promise<Paginated<Comment>>;
  findByCond(cond: CommentCondDTO): Promise<Comment>;
  findByIds(ids: string[], field: string, limit?: number): Promise<Array<Comment>>;
}

export interface ICommentCommandRepository {
  insert(dto: Comment): Promise<void>;
  update(id: string, dto: CommentUpdateDTO): Promise<void>;
  delete(id: string): Promise<void>;

  increaseLikeCount(id: string, field: string, step: number): Promise<void>;
  decreaseLikeCount(id: string, field: string, step: number): Promise<void>;
}