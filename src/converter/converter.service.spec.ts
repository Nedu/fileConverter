import { Test, TestingModule } from '@nestjs/testing';
import { ConverterService } from './converter.service';
import { CreateConvertDocumentDto } from './dto/convert-document.dto';

class ApiServiceMock {
  fileConversion() {
    return [];
  }
}

describe('ConverterService', () => {
  let service: ConverterService;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: ConverterService,
      useClass: ApiServiceMock,
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConverterService, ApiServiceProvider],
    }).compile();

    service = module.get<ConverterService>(ConverterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call fileConversion method with expected params', async () => {
    const convertFileSpy = jest.spyOn(service, 'fileConversion');
    const dto = new CreateConvertDocumentDto();
    service.fileConversion(dto.file, dto);
    expect(convertFileSpy).toHaveBeenCalledWith(dto.file, dto);
  });
});
