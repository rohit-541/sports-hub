import { Test, TestingModule } from '@nestjs/testing';
import { CategeoryService } from './categeory.service';

describe('CategeoryService', () => {
  let service: CategeoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategeoryService],
    }).compile();

    service = module.get<CategeoryService>(CategeoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
