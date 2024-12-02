import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, NotFoundException, Param, Patch, Post, Query, Request, UseGuards } from "@nestjs/common";
import { paginatedResponse, PagingDTO, pagingDTOSchema, PublicUser, Topic } from "src/share";
import { USER_RPC } from "src/share/di-token";
import { RemoteAuthGuard, RemoteAuthGuardOptional } from "src/share/guard";
import { IAuthorRpc, ReqWithRequester, ReqWithRequesterOpt } from "src/share/interface";
import { CreatePostDTO, PostCondDTO, postCondDTOSchema, Post as PostModel, UpdatePostDTO } from "../model";
import { POST_LIKED_RPC, POST_REPOSITORY, POST_SAVED_RPC, POST_SERVICE, TOPIC_QUERY } from "../post.di-token";
import { IPostLikedRPC, IPostRepository, IPostSavedRPC, IPostService, ITopicQueryRPC } from "../post.port";

@Controller('posts')
export class PostHttpController {
  constructor(
    @Inject(POST_SERVICE) private readonly service: IPostService,
    @Inject(POST_REPOSITORY) private readonly repo: IPostRepository,
    @Inject(USER_RPC) private readonly userRPC: IAuthorRpc,
    @Inject(TOPIC_QUERY) private readonly ITopicQueryRPC: ITopicQueryRPC,
    @Inject(POST_LIKED_RPC) private readonly postLikeRPC: IPostLikedRPC,
    @Inject(POST_SAVED_RPC) private readonly postSavedRPC: IPostSavedRPC,
  ) { }

  @Post()
  @UseGuards(RemoteAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Request() req: ReqWithRequester, @Body() dto: CreatePostDTO) {
    const { requester } = req;
    const data = await this.service.create({ ...dto, authorId: requester.sub });
    return { data };
  }

  @Get()
  @UseGuards(RemoteAuthGuardOptional)
  async listPost(@Request() req: ReqWithRequesterOpt, @Query() dto: PostCondDTO, @Query() paging: PagingDTO) {
    paging = pagingDTOSchema.parse(paging);
    dto = postCondDTOSchema.parse(dto);

    const result = await this.repo.list(dto, paging);

    const topicIds = result.data.map((item) => item.topicId);
    const authorIds = result.data.map((item) => item.authorId);
    const postIds = result.data.map((item) => item.id);

    const postLikeMap: Record<string, boolean> = {};
    const postSavedMap: Record<string, boolean> = {};

    const requester = req.requester;
    if (requester) {
      // when logged in
      const userId = requester.sub;
      const postLikedIds = await this.postLikeRPC.listPostIdsLiked(userId, postIds);
      postLikedIds.forEach((item) => {
        postLikeMap[item] = true;
      });

      const postSavedIds = await this.postSavedRPC.listPostIdsSaved(userId, postIds);
      postSavedIds.forEach((item) => {
        postSavedMap[item] = true;
      });
    }

    const topics = await this.ITopicQueryRPC.findByIds(topicIds);
    const users = await this.userRPC.findByIds(authorIds);

    const authorMap: Record<string, PublicUser> = {};
    const topicMap: Record<string, Topic> = {};


    users.forEach((u: PublicUser) => {
      authorMap[u.id] = u;
    });

    topics.forEach((t: Topic) => {
      topicMap[t.id] = t;
    });

    result.data = result.data.map((item) => {
      const topic = topicMap[item.topicId];
      const user = authorMap[item.authorId];

      return { ...item, topic, author: user, hasLiked: postLikeMap[item.id] === true, hasSaved: postSavedMap[item.id] === true } as PostModel;
    });

    return paginatedResponse(result, dto);
  }

  @Get(':id')
  @UseGuards(RemoteAuthGuardOptional)
  @HttpCode(HttpStatus.OK)
  async getPost(@Request() req: ReqWithRequesterOpt, @Param('id') id: string) {
    const result = await this.repo.get(id);

    if (!result) {
      return new NotFoundException();
    }

    const author = await this.userRPC.findById(result.authorId);
    const topic = await this.ITopicQueryRPC.findById(result.topicId);

    const { authorId, topicId, ...rest } = result;

    let hasLiked = false;
    let hasSaved = false;

    const requester = req.requester;
    if (requester) {
      const userId = requester.sub;
      hasLiked = await this.postLikeRPC.hasLikedId(userId, result.id);
      hasSaved = await this.postSavedRPC.hasSavedId(userId, result.id);
    }

    const data = { ...rest, topic, author, hasLiked, hasSaved };

    return { data };
  }

  @Patch(':id')
  @UseGuards(RemoteAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updatePost(@Request() req: ReqWithRequester, @Param('id') id: string, @Body() dto: UpdatePostDTO) {
    const { requester } = req;
    const result = await this.service.update(id, dto, requester);
    return { data: result };
  }

  @Delete(':id')
  @UseGuards(RemoteAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deletePost(@Request() req: ReqWithRequester, @Param('id') id: string) {
    const { requester } = req;
    const result = await this.service.delete(id, requester);
    return { data: result };
  }

  // RPC API (use internally)
  @Post('rpc/posts/list-by-ids')
  @HttpCode(HttpStatus.OK)
  async listPostByIds(@Body() dto: { ids: string[] }) {
    const { ids } = dto;

    const result = await this.repo.listByIds(ids);

    return { data: result };
  }

  @Get('rpc/posts/:id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    const data = await this.repo.get(id);

    if (!data) {
      return new NotFoundException();
    }

    return { data };
  }
}