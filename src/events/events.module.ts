import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaService } from 'src/prisma.service';
import { TeamsModule } from './teams/teams.module';
import { MatchModule } from './match/match.module';

@Module({
  controllers: [EventsController],
  providers: [EventsService,PrismaService],
  imports: [TeamsModule, MatchModule]
})
export class EventsModule {}
