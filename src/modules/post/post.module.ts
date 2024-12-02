import { Module, Provider } from '@nestjs/common';
import { config } from 'src/share/config';
import { REMOTE_AUTH_GUARD } from 'src/share/di-token';
import { RemoteAuthGuard } from 'src/share/guard';
import { ShareModule } from 'src/share/module';
import { PostHttpController, PostLikedRPC, PostPrismaRepository, PostSavedRPC, TopicQueryRPC } from './insfra';
import { PostConsumerController } from './insfra/post-consumer.controller';
import { POST_LIKED_RPC, POST_REPOSITORY, POST_SAVED_RPC, POST_SERVICE, TOPIC_QUERY } from './post.di-token';
import { PostService } from './service';

const dependencies: Provider[] = [
  { provide: POST_SERVICE, useClass: PostService },
  { provide: POST_REPOSITORY, useClass: PostPrismaRepository },
  { provide: TOPIC_QUERY, useFactory: () => new TopicQueryRPC(config.rpc.topicServiceURL) },
  { provide: POST_LIKED_RPC, useFactory: () => new PostLikedRPC(config.rpc.postLikeServiceURL) },
  { provide: POST_SAVED_RPC, useFactory: () => new PostSavedRPC(config.rpc.postSavedServiceURL) },
  { provide: REMOTE_AUTH_GUARD, useClass: RemoteAuthGuard },
];

@Module({
  imports: [ShareModule],
  controllers: [PostHttpController, PostConsumerController],
  providers: [...dependencies],
})
export class PostModule {}
