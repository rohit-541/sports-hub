import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Role, Roles, RolesGuard } from 'src/user/roles.gaurd';
import { MembershipService } from './membership.service';
import { membershipdto } from './data.validation';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Model } from 'mongoose';
import { MemberShipCategeory } from 'src/member-ship-categeory/member-ship-schema';
import { AuthGuard } from 'src/Auth/auth.gaurd';

@Controller('membership')
export class MembershipController {

    constructor(private membershipservice:MembershipService,
        @InjectModel(User.name) private userModel:Model<User>,
        @InjectModel(MemberShipCategeory.name) private memberShipCatModel:Model<MemberShipCategeory>
    ){}

    //Create a memberShip for user
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Post('/create')
    @UsePipes(new ValidationPipe())
    async createMemberShip(@Body() data:membershipdto){

        //verify user
        const user = await this.userModel.findById(data.user);
        if(!user){
            throw new BadRequestException("No userFound");
        }

        //verify membership
        const memberShip = await this.memberShipCatModel.findById(data.memberShip);
        if(!memberShip){
            throw new BadRequestException("MemberShip categeory is invalid");
        }

        //pass to service
        const newMembership = await this.membershipservice.createMemberShip(data);

        //add this membership to userAccount
         user.membership.push(memberShip._id);
         await user.save();
        //return membership
        return newMembership;
    }   

    //Remove a membership
    //only admin
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Delete('/:id')
    async deleteMemberShip(@Param() id:string){
        try {
            //delete the membership
            await this.membershipservice.deleteMemberShip(id);
            //return success 
            return {
                success:true,
                message:"Deleted Successfully"
            }
        } catch (error) {
            throw error
        }
    }

    //only admin
    //delete expired memberships(run daily one time) from dataBase
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Delete('/')
    async removeExpired(){
        try {
            await this.membershipservice.deleteAllExpired();
            return {
                success:true,
                message:"Deleted all expired memberships"
            }
        } catch (error) {
            throw error;
        }
    }

    //GetLogin token 
    //user
    @Roles(Role.User)
    @UseGuards(AuthGuard,RolesGuard)
    @Get('/loginToken')
    async loginToken(@Req() req:any){
        const userId = req.userId;
        const memberShipId = req.body.memberShip;

        //verify user

        //verify membership

        //verify membership belongs to user

        //generate a loginToken with userid and membershipid and expireTime(12h)
        
        //setMembership as active
        
        //return the token to user
    }

    //VerifyToken
    //Only staff
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Post('/verify')
    async verifyToken(@Body() token:string){
        //get token

        //get the payload from security

        //check expiry of token

        //get Userid and membership id

        //verify presence of user and membership

        //verify membership date with todayDate

        //provide details of user to staff with photo

    }


    //Logout user
    //Only Staff
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Post('/logoutuser')
    async logoutuser(@Body() token:string){
        //get token

        //if expired return 

        //get payload

        //get userId and membership 

        //verify user

        //verify memberShip

        //verify user == membership

        //set membership inactive

    }


    //getUser memberShips
    //user
    @Roles(Role.User)
    @UseGuards(AuthGuard,RolesGuard)
    @Get('/my-memberShips')
    async userMemberShips(){
        //get user id from req

        //verify user

        //get all memberShips with user == userId

        //return result
    }

}
