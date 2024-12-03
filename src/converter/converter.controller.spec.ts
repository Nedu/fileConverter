import { Test, TestingModule } from '@nestjs/testing';
import { ConverterController } from './converter.controller';
import { ConverterService } from './converter.service';
import { CreateConvertDocumentDto } from './dto/convert-document.dto';

describe('ConverterController', () => {
  let converterController: ConverterController;
  let converterService: ConverterService;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: ConverterService,
      useFactory: () => ({
        fileConversion: jest.fn(() => {}),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConverterController],
      providers: [ConverterService, ApiServiceProvider],
    }).compile();

    converterController = module.get<ConverterController>(ConverterController);
    converterService = module.get<ConverterService>(ConverterService);
  });

  it('should be defined', () => {
    expect(converterController).toBeDefined();
    expect(converterService).toBeDefined();
  });

  it('should call the fileConversion service', () => {
    const dto = new CreateConvertDocumentDto();
    expect(converterController.fileConversion(dto.file, dto)).not.toEqual(null);
    expect(converterService.fileConversion).toHaveBeenCalled();
    expect(converterService.fileConversion).toHaveBeenCalledWith(dto.file, dto);
  });

  it('should call the fileConversion service', () => {
    const dto = new CreateConvertDocumentDto();
    expect(converterController.fileConversion(dto.file, dto)).not.toEqual(null);
    expect(converterService.fileConversion).toHaveBeenCalled();
    expect(converterService.fileConversion).toHaveBeenCalledWith(dto.file, dto);
  });
});
