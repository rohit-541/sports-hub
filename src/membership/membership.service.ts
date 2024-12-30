import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { MemberShip } from './memberShip.Schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class MembershipService {

    constructor(@InjectModel(MemberShip.name) private MembershipModel:Model<MemberShip>){}

    async createMemberShip(data:any){
        data.start = Date.parse(data.start);
        data.end = Date.parse(data.end);
        data.user = new mongoose.Types.ObjectId(data.user);
        data.memberShip = new mongoose.Types.ObjectId(data.memberShip);

        const newMembership = new this.MembershipModel(data);
        await newMembership.save();
        return newMembership;
    }

    async deleteMemberShip(id:string){
        await this.MembershipModel.findOneAndDelete({
            _id:new ObjectId(id)
        });
    }

    async deleteAllExpired(){
        await this.MembershipModel.deleteMany({
            end:{
                $lt:Date.now()
            }
        })
    }

}
