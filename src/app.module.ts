import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberShipCategeoryModule } from './member-ship-categeory/member-ship-categeory.module';
import { MembershipController } from './membership/membership.controller';
import { MembershipModule } from './membership/membership.module';

@Module({
  imports: [UserModule,MongooseModule.forRoot('mongodb://localhost:27017/sports-hub'), MemberShipCategeoryModule, MembershipModule],
  controllers: [AppController, MembershipController ],
  providers: [AppService],
})
export class AppModule {}
