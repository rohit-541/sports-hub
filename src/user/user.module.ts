import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './user.schema';
import {  } from './roles.gaurd';
import { APP_GUARD } from '@nestjs/core';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports:[MongooseModule.forFeature([{name:User.name,schema:userSchema}])],
  controllers:[UserController],
  providers: [UserService,PrismaService]
})
export class UserModule {}
