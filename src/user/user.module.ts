import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './user.schema';
import {  } from './roles.gaurd';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports:[MongooseModule.forFeature([{name:User.name,schema:userSchema}])],
  controllers:[UserController],
  providers: [UserService]
})
export class UserModule {}
