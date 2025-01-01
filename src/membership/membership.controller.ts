import { BadRequestException, Body, Controller, Delete, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Role, Roles, RolesGuard } from 'src/user/roles.gaurd';
import { MembershipService } from './membership.service';
import { membershipdto } from './data.validation';
import { AuthGuard } from 'src/Auth/auth.gaurd';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

@Controller('membership')
export class MembershipController {

    constructor(private membershipservice:MembershipService,
                private jwtservice:JwtService
    ){}

    //Create a memberShip for user
    @UseInterceptors(FileInterceptor('image'))
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Post('/create')
    @UsePipes(new ValidationPipe())
    async createMemberShip(@Body() data:membershipdto,@Req() req:any,@UploadedFile(
        new ParseFilePipe({
            validators:[
                new MaxFileSizeValidator({maxSize:50000,message:"File size should be less than 50000kb"})
            ]
        })
    ) file:Express.Multer.File){
        try {
            const photo = file.buffer.toString('base64');
            const memberShip = await this.membershipservice.createMemberShip(data,photo);
            //return user
            return memberShip;
        } catch (error) {
            if(error instanceof PrismaClientValidationError){
                throw new BadRequestException("Invalid data format Please look into correct Data Format");
            }
            throw error
        }
    }   

    //Remove a membership
    //only admin
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Delete('/:id')
    async deleteMemberShip(@Param('id') id:string){
        try{

            //check if valid id is present or not
            const MemberShipId:number = Number(id);
            if(!MemberShipId){
                throw new BadRequestException("Please provide a valid id");
            }

            //delete the membership
            await this.membershipservice.deleteMemberShip(MemberShipId);
            //return success 
            return {
                success:true,
                message:"Deleted Membership successfully"
            }
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                return error.meta.cause;
            }

            throw error
        }
    }

    //GetLogin token 
    //user
    @Roles(Role.User)
    @UseGuards(AuthGuard,RolesGuard)
    @Get('/loginToken')
    async loginToken(@Req() req:any){
        const userId:number = Number(req.userId);   //Already verified as we are attaching this
        const memberShipId = Number(req.body.id);
        if(!memberShipId){
            throw new BadRequestException("Invalid MembershipId is provided");
        }

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
    @Post('/verifyToken')
    async verifyToken(@Body() data:any){

        const token:string = data.token;
        let payload:any;
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
        const user = await this.membershipservice.verifyToken(userId,memberShipId,token);

        //provide details of user to staff with photo
        return user;
    }


    //Logout user
    //Only Staff
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Post('/logout')
    async logoutuser(@Body() data:any){
        const token:string = data.token;
        //Get the payload
        try {
            const payload = await this.jwtservice.verifyAsync(token,
                {
                    secret:process.env.SECRETKEY
                }
            );

            console.log(payload);
            const {userId,memberShipId} = payload;
            await this.membershipservice.logoutUser(userId,memberShipId,token);
            return {
                success:true,
                message:"Logout Successfull"
            }
        } catch (error) {
            throw new BadRequestException("Invalid Qr Code");
        }
    }


    
    //Get all Memberships of a user
    @Roles(Role.User)
    @UseGuards(AuthGuard,RolesGuard)
    @Get('/my-memberShips')
    async allMemberships(@Req() req:any){
        try {
            //Get userid
            const id = Number(req.userId);
            const result = await this.membershipservice.allMemberships(id);
            return result;
        } catch (error) {
            throw error
        }
    }

}
