import { Test, TestingModule } from '@nestjs/testing';
import { YoutubeApiController } from './youtube-api.controller';

describe('YoutubeApiController', () => {
  let controller: YoutubeApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YoutubeApiController],
    }).compile();

    controller = module.get<YoutubeApiController>(YoutubeApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
