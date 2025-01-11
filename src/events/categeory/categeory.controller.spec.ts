import { Test, TestingModule } from '@nestjs/testing';
import { CategeoryController } from './categeory.controller';

describe('CategeoryController', () => {
  let controller: CategeoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategeoryController],
    }).compile();

    controller = module.get<CategeoryController>(CategeoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
