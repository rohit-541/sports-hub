import { Module } from '@nestjs/common';
import { CategeoryService } from './categeory.service';
import { CategeoryController } from './categeory.controller';
import { PrismaService } from 'src/prisma.service';
import { TeamsService } from '../teams/teams.service';

@Module({
  providers: [CategeoryService,PrismaService,TeamsService],
  controllers: [CategeoryController]
})
export class CategeoryModule {}
