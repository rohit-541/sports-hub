import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MembershipService {

    constructor(private Prisma:PrismaService){}

    //Create a New Membership
    async createMemberShip(data:any,photo:string){
        //verify user
        const user = await this.Prisma.user.findUnique({
            where:{kerbrosId:data.kerbrosId}
        });

        if(!user){
            throw new BadRequestException("User not found!");
        }

        //create data
        data.start = Date.parse(data.start);
        data.end = Date.parse(data.end);
        data.start = new Date(data.start);
        data.end = new Date(data.end);
        if(data.end < data.start){
            throw new BadRequestException("Membership dates are invalid");
        }

        data.photo = photo;

        //create a membership 
        const newMembership = this.Prisma.membership.create({
            data:data
        });

        return newMembership
    }

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

    //Get the loginToken
    async loginToken(userId:number,memberShipId:number){

        //verify user
        const user = await this.Prisma.user.findUnique({
            where:{id:userId},
        });

        if(!user){
            throw new BadRequestException("User is not found");
        }

        //verify membership
        const membership = await this.Prisma.membership.findUnique({
            where:{id:memberShipId}
        });

        if(!membership){
            throw new BadRequestException("Membership not found");
        }

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

        //set membership status as active 
        // Pros->to avoid usage of same token by two people   
        //Cons->User must have to loggout nessesarily
        if(membership.isActive){
            throw new BadRequestException("Someone is using your membership if this were not you email us your issue at: abc@email.com");
        }

        return membership;
    }

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

        //check if membership is active or not
        if(membership.isActive){
            throw new BadRequestException('Already logged in')
        }

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
