import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './modules/comment/comment.module';
import { FollowingModule } from './modules/following/following.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PostLikeModule } from './modules/post-like/post-like.module';
import { PostSaveModule } from './modules/post-save/post-save.module';
import { PostModule } from './modules/post/post.module';
import { TopicModule } from './modules/topic/topic.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserModule } from './modules/user/user.module';
import { ShareModule } from './share/module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ShareModule,
    UserModule,
    UploadModule,
    TopicModule,
    PostModule,
    CommentModule,
    PostLikeModule,
    PostSaveModule,
    FollowingModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}