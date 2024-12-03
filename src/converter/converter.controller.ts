import {
  Body,
  Controller,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ConverterService } from './converter.service';
import { CreateConvertDocumentDto } from './dto/convert-document.dto';

@Controller('/api/v1/converter')
export class ConverterController {
  constructor(private readonly converterService: ConverterService) {}

  @Post()
  @ApiTags('converter')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Convert a file between multiple formats.',
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            required: ['file'],
            properties: {
              file: { type: 'string', format: 'binary' },
              format: { type: 'string' },
              lineSeparator: { type: 'string' },
              elementSeparator: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async fileConversion(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() data: CreateConvertDocumentDto,
  ): Promise<StreamableFile> {
    return await this.converterService.fileConversion(file, data);
  }
}
