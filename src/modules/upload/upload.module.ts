import { Module } from '@nestjs/common';
import { UploadHttpController } from './upload-http.controller';

@Module({
  controllers: [UploadHttpController],
})

export class UploadModule {}
