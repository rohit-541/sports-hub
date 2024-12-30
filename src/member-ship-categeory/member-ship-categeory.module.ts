import { Module } from '@nestjs/common';
import { MemberShipCategeoryController } from './member-ship-categeory.controller';
import { MemberShipCategeoryService } from './member-ship-categeory.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberShipCategeory, MemberShipCategeorySchema } from './member-ship-schema';

@Module({
  imports:[MongooseModule.forFeature([{name:MemberShipCategeory.name,schema:MemberShipCategeorySchema}])],
  controllers: [MemberShipCategeoryController],
  providers:[MemberShipCategeoryService]
})
export class MemberShipCategeoryModule {}
