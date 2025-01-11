import { Test, TestingModule } from '@nestjs/testing';
import { OcmatchController } from './ocmatch.controller';

describe('OcmatchController', () => {
  let controller: OcmatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OcmatchController],
    }).compile();

    controller = module.get<OcmatchController>(OcmatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
