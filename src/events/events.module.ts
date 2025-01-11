import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaService } from 'src/prisma.service';
import { TeamsModule } from './teams/teams.module';
import { MatchModule } from './match/match.module';
import { HostelModule } from './hostel/hostel.module';
import { CategeoryModule } from './categeory/categeory.module';
import { OcmatchModule } from './ocmatch/ocmatch.module';



@Module({
  controllers: [EventsController],
  providers: [EventsService,PrismaService],
  imports: [TeamsModule, MatchModule, HostelModule, CategeoryModule, OcmatchModule]
})
export class EventsModule {}
