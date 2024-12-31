import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate, model, Model } from 'mongoose';
import { MemberShip } from './memberShip.Schema';
import { ObjectId } from 'mongodb';
import { User } from 'src/user/user.schema';
import { MemberShipCategeory } from 'src/member-ship-categeory/member-ship-schema';
import { start } from 'repl';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MembershipService {

    constructor(
        @InjectModel(MemberShip.name) private MembershipModel:Model<MemberShip>,
        @InjectModel(User.name) private userModel:Model<User>,
        @InjectModel(MemberShipCategeory.name) private memberShipCatModel:Model<MemberShipCategeory>
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

    //Get the loginToken
    async loginToken(userId:string,memberShipId:string){

        //verify user
        const user = await this.userModel.findById(userId).select('name photo kerbrosId');
        if(!user){
            throw new BadRequestException('No user found with follwing details');
        }

        //verify membership
        const memberShip = await this.MembershipModel.findById(memberShipId);

        if(!memberShip){
            throw new BadRequestException('No membership found');
        }

        //check if membership is expired or not
        if(memberShip.end < new Date()){
            //MemberShip is expired
            //delete memberShip from user and database
            await this.deleteMemberShip(memberShipId);
            throw new BadRequestException('Your memberShip has been expired');
        }

        //verify membership belongs to user
        if(!user._id.equals(memberShip.user)){
            throw new BadRequestException('This membership does not belong to user');
        }
        //setMembership as active
        memberShip.status = 'active';

        return true;
    }

    //Verify the Token
    async verifyToken(userId: string, memberShipId: string) {
        // Verify user
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new BadRequestException("User not found");
        }
    
        // Verify membership
        const membership: any = await this.MembershipModel.findById(memberShipId).populate('membershipCategory');
        if (!membership) {
            throw new BadRequestException("Membership not found");
        }
    
        // Verify membership belongs to user
        if (!user._id.equals(membership.user)) {
            throw new BadRequestException("This membership does not belong to the user");
        }

        //check if membership is active or not
        if(membership.status == 'active'){
            throw new BadRequestException('Already logged in')
        }

        // Aggregate to include membership category name (if required)
        await this.MembershipModel.aggregate([
            {
                $match: { _id: membership._id },
            },
            {
                $lookup: {
                    from: 'membershipcategories', // Replace with actual collection name
                    localField: 'membershipCategory',
                    foreignField: 'name',
                    as: 'membershipCategoryDetails',
                },
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    startDate: 1,
                    endDate: 1,
                    membershipCategoryName: { $arrayElemAt: ['$membershipCategoryDetails.name', 0] },
                },
            },
        ]);
        
        return {
            name:user.name,
            kerbrosId:user.kerbrosId,
            Categeory:membership.membershipCategory.name,
            start:membership.start,
            end:membership.end,
            photo:user.photo
        }
    }

    //getAll MemberShip
    async allMemberShip(userId:string){
        //verify user

        //get All memberShip 
        
        //return result
    }
    
}
