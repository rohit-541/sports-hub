import { Get, Inject, Injectable } from '@nestjs/common';
import { User, userDoc } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {

    //create userModel
    constructor(@InjectModel(User.name) private userModel:Model<User>){}

    //createuser
    async createUser(userData:any){
        const user = new this.userModel(userData);
        await user.save();
        return user;
    }
    
    async allUsers(){
        const result = await this.userModel.find().select(['name','kerbrosId','photo','role','membership']).populate('membership');
        return result;
    }


}
