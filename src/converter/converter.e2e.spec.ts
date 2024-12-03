import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ConverterService } from './converter.service';
import { INestApplication } from '@nestjs/common';
import { ConverterModule } from './converter.module';

describe('Cats', () => {
  let app: INestApplication;
  const converterService = { fileConversion: () => {} };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConverterModule],
    })
      .overrideProvider(ConverterService)
      .useValue(converterService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/POST fileConverter`, () => {
    return request(app.getHttpServer()).post('/api/v1/converter').expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
