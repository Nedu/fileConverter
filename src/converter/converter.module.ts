import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConverterController } from './converter.controller';
import { ConverterService } from './converter.service';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: 'src/converter/assets/upload/files',
        filename: (req, file, cb) => {
          return cb(null, file.originalname);
        },
      }),
    }),
  ],
  controllers: [ConverterController],
  providers: [ConverterService],
})
export class ConverterModule {}
