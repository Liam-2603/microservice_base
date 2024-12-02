import { Module, Provider } from '@nestjs/common';
import { ShareModule } from 'src/share/module';
import { TOPIC_REPOSITORY, TOPIC_SERVICE } from './token.di-token';
import { TopicPrismaRepository } from './topic-prisma.repo';
import { TopicController, TopicRpcController } from './topic.controller';
import { TopicService } from './topic.service';

const repositories: Provider[] = [
  { provide: TOPIC_REPOSITORY, useClass: TopicPrismaRepository },
];

const services: Provider[] = [
  { provide: TOPIC_SERVICE, useClass: TopicService },
];

@Module({
  imports: [ShareModule],
  controllers: [TopicController, TopicRpcController],
  providers: [...repositories, ...services],
})

export class TopicModule {}
