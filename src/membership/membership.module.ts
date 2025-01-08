import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports:[JwtModule.register({
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
