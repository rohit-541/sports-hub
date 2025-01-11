import { Test, TestingModule } from '@nestjs/testing';
import { OcmatchService } from './ocmatch.service';

describe('OcmatchService', () => {
  let service: OcmatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OcmatchService],
    }).compile();

    service = module.get<OcmatchService>(OcmatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
