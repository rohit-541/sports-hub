import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MembershipModule } from './membership/membership.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), UserModule,MongooseModule.forRoot('mongodb://localhost:27017/sports-hub'), MembershipModule],
  controllers: [AppController ],
  providers: [AppService],
})
export class AppModule {}
