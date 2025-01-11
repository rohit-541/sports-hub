import { Module } from '@nestjs/common';
import { CategeoryService } from './categeory.service';
import { CategeoryController } from './categeory.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [CategeoryService,PrismaService],
  controllers: [CategeoryController]
})
export class CategeoryModule {}
