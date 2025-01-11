import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { PrismaService } from 'src/prisma.service';
import { TeamsService } from '../teams/teams.service';

@Module({
  controllers: [MatchController],
  providers: [MatchService,PrismaService,TeamsService]
})
export class MatchModule {}
