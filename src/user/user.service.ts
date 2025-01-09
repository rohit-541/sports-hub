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

        try {
            //create user in prisma
            const newUser = await this.Prisma.user.create({
                data:userData
            });
            return newUser;
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    
    async allUsers(){
        const result = await this.Prisma.user.findMany({
            select:{
                id:true,
                name:true,
                kerbros:true
            }
        })
        return result;
    }
}
