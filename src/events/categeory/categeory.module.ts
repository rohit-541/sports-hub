import { Module } from '@nestjs/common';
import { CategeoryService } from './categeory.service';
import { CategeoryController } from './categeory.controller';

@Module({
  providers: [CategeoryService],
  controllers: [CategeoryController]
})
export class CategeoryModule {}
