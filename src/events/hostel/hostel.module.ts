import { Module } from '@nestjs/common';
import { HostelController } from './hostel.controller';
import { HostelService } from './hostel.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [HostelController],
  providers: [HostelService, PrismaService],
})
export class HostelModule {}
