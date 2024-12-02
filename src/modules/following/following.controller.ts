import { Controller, Delete, Get, HttpCode, Inject, Param, Post, Query, Request, UseGuards } from "@nestjs/common";
import { paginatedResponse, PagingDTO, pagingDTOSchema, ReqWithRequester } from "src/share";
import { RemoteAuthGuard } from "src/share/guard";
import { FOLLOWING_SERVICE } from "./following.di-token";
import { IFollowingService } from "./following.port";

@Controller()
export class FollowingController {
  constructor(@Inject(FOLLOWING_SERVICE) private readonly service: IFollowingService) { }

  @Get('users/:id/has-followed')
  @UseGuards(RemoteAuthGuard)
  @HttpCode(200)
  async hasFollowed(@Request() req: ReqWithRequester, @Param('id') followingId: string) {
    const { sub } = req.requester;
    const result = await this.service.hasFollowed(sub, followingId);
    return { data: result };
  }

  @Post('users/:id/follow')
  @UseGuards(RemoteAuthGuard)
  @HttpCode(200)
  async follow(@Request() req: ReqWithRequester, @Param('id') followingId: string) {
    const { sub } = req.requester;

    const dto = {
      followerId: sub,
      followingId
    };
    const result = await this.service.follow(dto);

    return { data: result };
  }

  @Delete('users/:id/unfollow')
  @UseGuards(RemoteAuthGuard)
  @HttpCode(200)
  async unfollow(@Request() req: ReqWithRequester, @Param('id') followingId: string) {
    const { sub } = req.requester;

    const dto = {
      followerId: sub,
      followingId
    };

    const result = await this.service.unfollow(dto);

    return { data: result };
  }

  @Get('users/:id/followers')
  @UseGuards(RemoteAuthGuard)
  @HttpCode(200)
  async listFollowers(@Request() req: ReqWithRequester, @Param('id') followingId: string, @Query() paging: PagingDTO) {
    const pagingDTO = pagingDTOSchema.parse(paging);
    const result = await this.service.listFollowers(followingId, pagingDTO);

    return paginatedResponse(result, {});
  }

  @Get('users/:id/followings')
  @UseGuards(RemoteAuthGuard)
  @HttpCode(200)
  async listFollowings(@Request() req: ReqWithRequester, @Param('id') followerId: string, @Query() paging: PagingDTO) {
    const pagingDTO = pagingDTOSchema.parse(paging);

    const result = await this.service.listFollowings(followerId, pagingDTO);
    return paginatedResponse(result, {});
  }
}