import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MembershipModule } from './membership/membership.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';


@Module({
  imports: [ConfigModule.forRoot(), UserModule,MembershipModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
