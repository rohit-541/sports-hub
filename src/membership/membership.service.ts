import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate, model, Model } from 'mongoose';
import { MemberShip } from './memberShip.Schema';
import { ObjectId } from 'mongodb';
import { start } from 'repl';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MembershipService {

    constructor(private Prisma:PrismaService){}
    constructor(private Prisma:PrismaService){}

    //Create a New Membership
    async createMemberShip(data:any,userId:number){
    async createMemberShip(data:any,photo:string){
        //verify user
  // Verify user
        const user = await this.Prisma.user.findUnique({
            where: { id: userId },
        });
        const user = await this.Prisma.user.findUnique({
            where:{kerbrosId:data.kerbrosId}
        });

        console.log(user)
        if(!user){
            throw new BadRequestException("User not found!");
        }

        data.start = new Date(data.start);
        data.end = new Date(data.end);

        //check is membership has invalid date
        if(data.start > data.end){
            throw new BadRequestException("Invalid start and end date");
        //create data
        data.start = Date.parse(data.start);
        data.end = Date.parse(data.end);
        data.start = new Date(data.start);
        data.end = new Date(data.end);
        if(data.end < data.start){
            throw new BadRequestException("Membership dates are invalid");
        }

        data.photo = photo;

        console.log(data);
        //create a membership 
        const newMembership = await this.Prisma.membership.create({
            data:data
        })
        const newMembership = this.Prisma.membership.create({
            data:data
        });

        return newMembership;
    }

    // //delete a membership
    // async deleteMemberShip(id:string){
    //     //verify membership
    //     const memberShip = await this.MembershipModel.findById(id);

    //     if(!memberShip){
    //         return;
    //     }

    //     const user = await this.userModel.findById(memberShip.user);

    //     //no user found then returns Invalid membership
    //     if(!user){
    //         throw new BadRequestException('User is not present with these details');
    //     }

    //     const index =user.membership.findIndex(p=>{
    //         return p.equals(new ObjectId(id));
    //     });
    //     if(index != -1){
    //         //delete membership
    //         user.membership.splice(index,1);
    //         await user.save();
    //     }

    //     //delete the membership
    //     await memberShip.deleteOne({_id:new ObjectId(id)});
    // }
    //delete a membership
    async deleteMemberShip(id:number){
        //verify membership
        const memberShip = await this.Prisma.membership.delete({
            where:{id:id}
        });

        return {
            success:true,
            message:"Membership Deleted Successfully"
        }
    }

    // //Get the loginToken
    // async loginToken(userId:string,memberShipId:string){
    //Get the loginToken
    async loginToken(userId:number,memberShipId:number){

    //     //verify user
    //     const user = await this.userModel.findById(userId).select('name photo kerbrosId');
    //     if(!user){
    //         throw new BadRequestException('No user found with follwing details');
    //     }
        //verify user
        const user = await this.Prisma.user.findUnique({
            where:{id:userId},
        });

        if(!user){
            throw new BadRequestException("User is not found");
        }

    //     //verify membership
    //     const memberShip = await this.MembershipModel.findById(memberShipId);
        //verify membership
        const membership = await this.Prisma.membership.findUnique({
            where:{id:memberShipId}
        });

    //     if(!memberShip){
    //         throw new BadRequestException('No membership found');
    //     }
        if(!membership){
            throw new BadRequestException("Membership not found");
        }

    //     //check if membership is expired or not
    //     if(memberShip.end < new Date()){
    //         //MemberShip is expired
    //         //delete memberShip from user and database
    //         await this.deleteMemberShip(memberShipId);
    //         throw new BadRequestException('Your memberShip has been expired');
    //     }
        if(membership.kerbrosId != user.kerbrosId){
            throw new BadRequestException("Membership does not belong to user");
        }
        
        //check for expired memberships 
        //To-Do->maintain the list of past memberships
        if(membership.end < membership.start){
            await this.Prisma.membership.delete({
                where:{id:memberShipId}
            });

            throw new BadRequestException("Your membership is expired");
        };

    //     //verify membership belongs to user
    //     if(!user._id.equals(memberShip.user)){
    //         throw new BadRequestException('This membership does not belong to user');
    //     }
    //     //setMembership as active
    //     memberShip.status = 'active';

    //     return true;
    // }
        //set membership status as active 
        // Pros->to avoid usage of same token by two people   
        //Cons->User must have to loggout nessesarily
        if(membership.isActive){
            throw new BadRequestException("Someone is using your membership if this were not you email us your issue at: abc@email.com");
        }

        return membership;
    }

    // //Verify the Token
    // async verifyToken(userId: string, memberShipId: string) {
    //     // Verify user
    //     const user = await this.userModel.findById(userId);
    //     if (!user) {
    //         throw new BadRequestException("User not found");
    //     }
    
    //     // Verify membership
    //     const membership: any = await this.MembershipModel.findById(memberShipId).populate('membershipCategory');
    //     if (!membership) {
    //         throw new BadRequestException("Membership not found");
    //     }
    
    //     // Verify membership belongs to user
    //     if (!user._id.equals(membership.user)) {
    //         throw new BadRequestException("This membership does not belong to the user");
    //     }
    //Verify the Token
    async verifyToken(userId: number, memberShipId: number,token:string) {
        // Verify user
        const user = await this.Prisma.user.findUnique({
            where:{id:userId}
        });

        if (!user) {
            throw new BadRequestException("User not found");
        }
        
        // Verify membership
        const membership = await this.Prisma.membership.findUnique(
            {
                where:{id:memberShipId},
                select:{
                    userName:true,
                    kerbrosId:true,
                    name:true,
                    start:true,
                    end:true,
                    photo:true,
                    isActive:true
                }
            }
        );
    
        //verify that membership belongs to user
        if(user.kerbrosId != membership.kerbrosId){
            throw new BadRequestException("This membership does not belong to user");
        }

    //     //check if membership is active or not
    //     if(membership.status == 'active'){
    //         throw new BadRequestException('Already logged in')
    //     }
        //check if membership is active or not
        if(membership.isActive){
            throw new BadRequestException('Already logged in')
        }

    //     // Aggregate to include membership category name (if required)
    //     await this.MembershipModel.aggregate([
    //         {
    //             $match: { _id: membership._id },
    //         },
    //         {
    //             $lookup: {
    //                 from: 'membershipcategories', // Replace with actual collection name
    //                 localField: 'membershipCategory',
    //                 foreignField: 'name',
    //                 as: 'membershipCategoryDetails',
    //             },
    //         },
    //         {
    //             $project: {
    //                 _id: 1,
    //                 user: 1,
    //                 startDate: 1,
    //                 endDate: 1,
    //                 membershipCategoryName: { $arrayElemAt: ['$membershipCategoryDetails.name', 0] },
    //             },
    //         },
    //     ]);
        
    //     return {
    //         name:user.name,
    //         kerbrosId:user.kerbrosId,
    //         Categeory:membership.membershipCategory.name,
    //         start:membership.start,
    //         end:membership.end,
    //         photo:user.photo
    //     }
    // }

    // //getAll MemberShip
    // async allMemberShip(userId:string){
    //     //verify user

    //     //get All memberShip 
        
    //     //return result
    // }

        await this.Prisma.membership.update({
            where:{id:memberShipId},
            data:{
                isActive:true,
                tokens:token
            }
        });

        return membership; 
    }

    //logout the user
    async logoutUser(userId:number,memberShipId:number,token:string){
        
        //verify User to avoid any false requests 
        const user = await this.Prisma.user.findUnique({
            where:{id:userId}
        });

        if(!user){
            throw new BadRequestException("User not found");
        }

        await this.Prisma.membership.update({
            where:{
                id:memberShipId,
                kerbrosId:user.kerbrosId
            },
            data:{
                isActive:false,
                tokens:null
            }
        });
    }

    //getAll MemberShip of a user
    //get userid->from user
    async allMemberships(userId: number) {
        
        // Verify user existence
        const user = await this.Prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                kerbrosId: true,
                memberships: {
                    where: {
                        end: { gt: new Date() },
                    },
                    select:{
                        userName:true,
                        kerbrosId:true,
                        name:true,
                        start:true,
                        end:true,
                        isActive:true
                    }
                },
            },
        });
    
        if (!user) {
            throw new BadRequestException("User not found");
        }
    
        // Delete expired memberships
        await this.Prisma.membership.deleteMany({
            where: {
                end: { lte: new Date() }, 
            },
        });
    
        // Return valid memberships
        return user.memberships;
    }
    
    
}
