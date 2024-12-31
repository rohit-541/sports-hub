import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Role, Roles, RolesGuard } from 'src/user/roles.gaurd';
import { MembershipService } from './membership.service';
import { membershipdto } from './data.validation';
import { AuthGuard } from 'src/Auth/auth.gaurd';
import { JwtService } from '@nestjs/jwt';

@Controller('membership')
export class MembershipController {

    constructor(private membershipservice:MembershipService,
                private jwtservice:JwtService
    ){}

    //Create a memberShip for user
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Post('/create')
    @UsePipes(new ValidationPipe())
    async createMemberShip(@Body() data:membershipdto,@Req() req:any){
        try {
            //try creating a user   
            const userId = req.userId;
            const user = await this.membershipservice.createMemberShip(data,userId);
            //return user
            return user;
        } catch (error) {
            throw error
        }
    }   

    //Remove a membership
    //only admin
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Delete('/:id')
    async deleteMemberShip(@Param('id') id:string){
        try {
            //delete the membership
            await this.membershipservice.deleteMemberShip(id);
            //return success 
            return {
                success:true,
                message:"Deleted Membership successfully"
            }
        } catch (error) {
            throw error
        }
    }

    //GetLogin token 
    //user
    @Roles(Role.User)
    @UseGuards(AuthGuard,RolesGuard)
    @Get('/loginToken')
    async loginToken(@Req() req:any){
        const userId = req.userId;
        const memberShipId = req.body.memberShipId;

        try {
            await this.membershipservice.loginToken(userId,memberShipId);
            const token = this.jwtservice.signAsync({
                userId:userId,
                memberShipId:memberShipId
            },{
                secret:process.env.SECRETKEY,
            });

            return token
        } catch (error) {
            throw error;
        }
    }

    //VerifyToken
    //Only staff
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Post('/verify')
    async verifyToken(@Body() data:any){

        const token:string = data.token;
        let payload;
        try {
            //get the payload from security
            payload = await this.jwtservice.verifyAsync(token,{
                secret:process.env.SECRETKEY
            });
        } catch (error) {
            throw new BadRequestException("Invalid Qr Code")
        }

        //get Userid and membership id
        const {userId , memberShipId} = payload;
        //verify presence of user and membership
        const user = await this.membershipservice.verifyToken(userId,memberShipId);
        //provide details of user to staff with photo
        return user;
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
