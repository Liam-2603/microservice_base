import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Query, Request, UseGuards } from "@nestjs/common";
import { paginatedResponse, PagingDTO, pagingDTOSchema, PublicUser } from "src/share";
import { USER_RPC } from "src/share/di-token";
import { RemoteAuthGuard } from "src/share/guard";
import { IAuthorRpc, ReqWithRequester } from "src/share/interface";
import { POST_LIKE_REPOSITORY, POST_LIKE_SERVICE } from "./post-like.di-token";
import { IPostLikeRepository, IPostLikeService } from "./post-like.port";

@Controller('posts')
export class PostLikeHttpController {
  constructor(
    @Inject(POST_LIKE_SERVICE) private readonly usecase: IPostLikeService,
    @Inject(POST_LIKE_REPOSITORY) private readonly repo: IPostLikeRepository,
    @Inject(USER_RPC) private readonly userRepo: IAuthorRpc
  ) { }

  @Post(':id/like')
  @UseGuards(RemoteAuthGuard)
  @HttpCode(HttpStatus.OK)
  async like(@Param('id') postId: string, @Request() req: ReqWithRequester) {
    const { sub } = req.requester;
    const data = await this.usecase.like({ postId, userId: sub });
    return { data };
  }


  @Delete(':id/unlike')
  @UseGuards(RemoteAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unlike(@Param('id') postId: string, @Request() req: ReqWithRequester) {
    const { sub } = req.requester;
    const data = await this.usecase.unlike({ postId, userId: sub });
    return { data };
  }

  @Get(':id/liked-users')
  @HttpCode(HttpStatus.OK)
  async getLikes(@Param('id') postId: string, @Query() paging: PagingDTO) {
    const pagingData = pagingDTOSchema.parse(paging);

    const result = await this.repo.list(postId, pagingData);

    const userIds = result.data.map((item) => item.userId);
    const users = await this.userRepo.findByIds(userIds);

    const userMap: Record<string, PublicUser> = {};
    users.map((user) => {
      userMap[user.id] = user;
    });

    const finalResult = result.data.map((item) => {
      const user = userMap[item.userId];
      return { user, likedAt: item.createdAt };
    });

    return paginatedResponse({ ...result, data: finalResult }, {});
  }
}

@Controller('rpc')
export class PostLikeRpcController {
  constructor(
    @Inject(POST_LIKE_REPOSITORY) private readonly repo: IPostLikeRepository,
  ) { }

  @Post('has-liked')
  @HttpCode(HttpStatus.OK)
  async hasLiked(@Body() req: { userId: string, postId: string; }) {
    try {
      const result = await this.repo.get(req);
      return { data: result !== null };
    } catch (e) {
      return { data: false };
    }
  }

  @Post('list-post-ids-liked')
  @HttpCode(HttpStatus.OK)
  async listPostIdsLiked(@Body() req: { userId: string, postIds: string[]; }) {
    const data = await this.repo.listPostIdsLiked(req.userId, req.postIds);
    return { data };
  }
}

