import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberShip } from './memberShip.Schema';
import { ObjectId } from 'mongodb';
import { User } from 'src/user/user.schema';

@Injectable()
export class MembershipService {

    constructor(@InjectModel(MemberShip.name) private MembershipModel:Model<MemberShip>,
     @InjectModel(User.name) private userModel:Model<User>
){}

    //Create a New Membership
    async createMemberShip(data:any,userId:string){
        //verify user
        const user = await this.userModel.findById(userId);
        if(!user){
            throw new BadRequestException("User not found!");
        }

        //create data
        data.start = Date.parse(data.start);
        data.end = Date.parse(data.end);
        if(data.end < data.start){
            throw new BadRequestException("Membership dates are invalid");
        }

        //create a membership 
        const newMembership = new this.MembershipModel(data);
        await newMembership.save();

        //save into the user data
        user.membership.push(newMembership._id);
        await user.save();

        return newMembership
    }

    //delete a membership
    async deleteMemberShip(id:string){
        //verify membership
        const memberShip = await this.MembershipModel.findById(id);

        if(!memberShip){
            return;
        }

        const user = await this.userModel.findById(memberShip.user);

        //no user found then returns Invalid membership
        if(!user){
            throw new BadRequestException('User is not present with these details');
        }

        const index =user.membership.findIndex(p=>{
            return p.equals(new ObjectId(id));
        });
        if(index != -1){
            //delete membership
            user.membership.splice(index,1);
            await user.save();
        }

        //delete the membership
        await memberShip.deleteOne({_id:new ObjectId(id)});
    }

    
}
