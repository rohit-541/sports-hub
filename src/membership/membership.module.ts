import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberShip, MemberShipSchema } from './memberShip.Schema';
import { MemberShipCategeory, MemberShipCategeorySchema } from 'src/member-ship-categeory/member-ship-schema';
import { User, userSchema } from 'src/user/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports:[MongooseModule.forFeature([
    {
      name:MemberShip.name,
      schema:MemberShipSchema
    },
    {
      name:MemberShipCategeory.name,
      schema:MemberShipCategeorySchema
    },
    {
      name:User.name,
      schema:userSchema
    }]),JwtModule.register({
      global:true,
      secret:process.env.SECRETKEY,
      signOptions:{
        expiresIn:'12h'
      }
    })],

  controllers:[MembershipController],
  providers: [MembershipService,PrismaService]
})
export class MembershipModule {}
