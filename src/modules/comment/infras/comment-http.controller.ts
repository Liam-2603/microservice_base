import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { paginatedResponse, pagingDTOSchema, ReqWithRequester } from "src/share";
import { RemoteAuthGuard } from "src/share/guard";
import { COMMENT_SERVICE } from "../comment.di-token";
import { ICommentService } from "../comment.port";
import { CommentCondDTO, commentCondDTOSchema, CommentCreateDTO, CommentUpdateDTO } from "../model";

@Controller()
export class CommentHttpController {
  constructor(@Inject(COMMENT_SERVICE) private readonly service: ICommentService) { }

  @Get('/posts/:id/comments')
  @HttpCode(HttpStatus.OK)
  async listComment(@Param('id') postId: string, @Query() query: any) {
    const dto: CommentCondDTO = { postId, ...query };

    const cond = commentCondDTOSchema.parse(dto);
    const paging = pagingDTOSchema.parse(query);
    const data = await this.service.list(cond, paging);

    return paginatedResponse(data, cond);
  }

  @Post('/posts/:id/comments')
  @UseGuards(RemoteAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createComment(@Param('id') postId: string, @Body() dto: CommentCreateDTO, @Request() req: ReqWithRequester) {
    const { requester } = req;

    const data = await this.service.create({ ...dto, userId: requester.sub, postId });
    return { data };
  }

  @Patch('/comments/:id')
  @UseGuards(RemoteAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateComment(@Param('id') id: string, @Body() dto: CommentUpdateDTO, @Request() req: ReqWithRequester) {
    const { requester } = req;
    const data = await this.service.update(id, requester, dto);
    return { data };
  }

  @Delete('/comments/:id')
  @UseGuards(RemoteAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteComment(@Param('id') id: string, @Request() req: ReqWithRequester) {
    const { requester } = req;
    const data = await this.service.delete(id, requester);
    return { data };
  }
}