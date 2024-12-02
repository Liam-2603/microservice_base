import { Module } from '@nestjs/common';
import { config } from 'src/share/config';
import { ShareModule } from 'src/share/module';
import { PostLikeHttpController, PostLikeRpcController } from './post-like.controller';
import { POST_LIKE_REPOSITORY, POST_LIKE_SERVICE, POST_QUERY_REPOSITORY } from './post-like.di-token';
import { PostLikeRepository, PostQueryRPC } from './post-like.repository';
import { PostLikeService } from './post-like.service';

const dependencies = [
  { provide: POST_LIKE_REPOSITORY, useClass: PostLikeRepository },
  { provide: POST_QUERY_REPOSITORY, useFactory: () => new PostQueryRPC(config.rpc.postServiceURL) },
  { provide: POST_LIKE_SERVICE, useClass: PostLikeService },
];

@Module({
  imports: [ShareModule],
  controllers: [PostLikeHttpController, PostLikeRpcController],
  providers: [...dependencies],
})
export class PostLikeModule {}
