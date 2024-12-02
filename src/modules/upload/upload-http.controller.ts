import { BadRequestException, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import fs from 'fs';
import { diskStorage } from "multer";
import { config } from "src/share/config";

@Controller('upload-file')
export class UploadHttpController {
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      const isImage = file.mimetype.startsWith('image');
    
      if (isImage) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Invalid file type'), false);
      }
    },
    limits: {
      fileSize: 512 * 1024 // 512 KB
    },
    storage: diskStorage({
      destination: (req, file, cb) => {
        ensureDirectoryExistence('./uploads');
        cb(null, './uploads');
      },
      filename: function (req, file, cb) {
        const hrtime = process.hrtime();
        const prefix = `${hrtime[0] * 1e6}`;
        cb(null, `${prefix}_${file.originalname}`);
      }
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUploaded = {
      filename: file.originalname,
      url: `${config.upload.cdn}/${file.filename}`,
      ext: file.originalname.split('.').pop() || '',
      contentType: file.mimetype,
      size: file.size,
      file: file.buffer
    };

    return { data: fileUploaded };
  }
}

const ensureDirectoryExistence = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};
