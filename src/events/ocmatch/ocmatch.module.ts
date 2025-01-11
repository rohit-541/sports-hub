import { Module } from '@nestjs/common';
import { OcmatchController } from './ocmatch.controller';
import { OcmatchService } from './ocmatch.service';
import { PrismaService } from 'src/prisma.service';
import { TeamsService } from '../teams/teams.service';

@Module({
  controllers: [OcmatchController],
  providers: [OcmatchService,PrismaService,TeamsService]
})
export class OcmatchModule {}
