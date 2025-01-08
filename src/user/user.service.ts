import { Get, Inject, Injectable } from '@nestjs/common';
import { User, userDoc } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {

    //create userModel
    constructor(private Prisma:PrismaService){}

    //createuser
    async createUser(userData:any){
        const newuser = await this.Prisma.user.create({
            data:{
                name:"Rohit",
                kerbros:"ce1230581"
            }
        });

        return newuser;
    }
    
    async allUsers(){
    }
}
