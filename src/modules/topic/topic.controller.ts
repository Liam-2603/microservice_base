import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { paginatedResponse, PagingDTO, pagingDTOSchema, UserRole } from 'src/share';
import { RemoteAuthGuard, Roles, RolesGuard } from 'src/share/guard';
import { TOPIC_REPOSITORY, TOPIC_SERVICE } from './token.di-token';
import { TopicCondDTO, TopicCreationDTO, TopicUpdateDTO } from './topic.model';
import { ITopicRepository, ITopicService } from './topic.port';

@Controller('topics')
export class TopicController {
  constructor(
    @Inject(TOPIC_SERVICE) private readonly service: ITopicService) {}

  @Post()
  @UseGuards(RemoteAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createTopic(@Body() dto: TopicCreationDTO) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Patch(':id')
  @UseGuards(RemoteAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateTopic(@Param('id') id: string, @Body() dto: TopicUpdateDTO) {
    const data = await this.service.update(id, dto);
    return { data };
  }

  @Delete(':id')
  @UseGuards(RemoteAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async deleteTopic(@Param('id') id: string) {
    const data = await this.service.delete(id);
    return { data };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async listTopics(@Query() pading: PagingDTO, @Query() dto: TopicCondDTO) {
    const paging = pagingDTOSchema.parse(pading);
    const data = await this.service.list(dto, paging);
    return paginatedResponse(data, dto);
  }
}

@Controller('rpc/topics')
export class TopicRpcController {
  constructor(
    @Inject(TOPIC_REPOSITORY) private readonly repository: ITopicRepository) {}

  @Post('list-by-ids')
  @HttpCode(HttpStatus.OK)
  async listByIds(@Body('ids') ids: string[]) {
    const data = await this.repository.findByIds(ids);
    return { data };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    const data = await this.repository.findById(id);

    if (!data) {
      throw new NotFoundException();
    }

    return { data };
  }
}
