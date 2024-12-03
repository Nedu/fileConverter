import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateConvertDocumentDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: any;

  @ApiProperty({ example: 'json|xml|string', required: true })
  @IsString()
  format: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(1)
  lineSeparator?: string;

  @ApiProperty({ required: false })
  @IsString()
  @MaxLength(1)
  elementSeparator?: string;
}
