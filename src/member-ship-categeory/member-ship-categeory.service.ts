import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MembershipCat, MemberShipCategeory } from './member-ship-schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class MemberShipCategeoryService {

    //Create a model
    constructor(@InjectModel(MemberShipCategeory.name) private MemberShipCatModel:Model<MemberShipCategeory>){}

    //create a membershipcategeory
    async createMemberShipCat(data:any){
        //Create a new Categeory
        const newCat = new this.MemberShipCatModel(data);
        //save in dataBase and return 
        await newCat.save();
        return newCat;
    }

    //delete a categeory
    async deleteMemberShipCat(id:string){
        try {
            const result = await this.MemberShipCatModel.deleteOne({_id:new mongoose.Types.ObjectId(id)});
            return result;
        } catch (error) {
            console.log(error)
            console.log("Error in service");
        }
    }
}
