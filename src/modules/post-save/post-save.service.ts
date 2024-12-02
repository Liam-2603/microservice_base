import { Inject, Injectable } from "@nestjs/common";
import { IPostRpc } from "src/share";
import { AppError } from "src/share/app-error";
import { POST_RPC } from "src/share/di-token";
import { POST_SAVE_REPOSITORY } from "./post-save.di-token";
import { ActionDTO, actionDTOSchema, ErrPostAlreadySaved, ErrPostHasNotSaved, ErrPostNotFound, PostSave } from "./post-save.model";
import { IPostSaveRepository, IPostSaveService } from "./post-save.port";

@Injectable()
export class PostSaveService implements IPostSaveService {
  constructor(
    @Inject(POST_SAVE_REPOSITORY) private readonly repository: IPostSaveRepository,
    @Inject(POST_RPC) private readonly postRpc: IPostRpc,
  ) { }

  async save(dto: ActionDTO): Promise<boolean> {
    const data = actionDTOSchema.parse(dto);
    const { postId } = data;

    const existedAction = await this.repository.get(data);

    if (existedAction) {
      throw AppError.from(ErrPostAlreadySaved, 400);
    }

    const existed = await this.postRpc.findById(postId);

    if (!existed) {
      throw AppError.from(ErrPostNotFound, 404);
    }

    const newData: PostSave = { ...data, createdAt: new Date() };
    const result = await this.repository.insert(newData);
    return result;
  }

  async unsave(dto: ActionDTO): Promise<boolean> {
    const data = actionDTOSchema.parse(dto);

    const existedAction = await this.repository.get(data);

    if (!existedAction) {
      throw AppError.from(ErrPostHasNotSaved, 400);
    }

    const result = await this.repository.delete(data);
    return result;
  }
}