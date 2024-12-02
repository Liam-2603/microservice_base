import { Module, Provider } from '@nestjs/common';
import { ShareModule } from 'src/share/module';
import { COMMENT_REPOSITORY, COMMENT_SERVICE } from './comment.di-token';
import { CommentHttpController } from './infras/comment-http.controller';
import { CommentPrismaRepository } from './infras/comment-prisma.repo';
import { CommentService } from './service';

const dependencies: Provider[] = [
  { provide: COMMENT_SERVICE, useClass: CommentService },
  { provide: COMMENT_REPOSITORY, useClass: CommentPrismaRepository },
];

@Module({
  imports: [ShareModule],
  controllers: [CommentHttpController],
  providers: [...dependencies],
})
export class CommentModule {}
