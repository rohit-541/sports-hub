import { BadRequestException, Body, Controller, Get, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import {userDTO } from './user.validation';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { userDoc } from './user.schema';
import { Role, Roles } from './roles.gaurd';

@Controller('user')
export class UserController {

    constructor(private UserService:UserService){}

    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new ValidationPipe())
    @Post('/register')
    async registerUser(@Body() data:userDTO,@UploadedFile(
        new ParseFilePipe({
            validators:[
                new MaxFileSizeValidator({maxSize:50000,message:"File size should be less than 50kb"})
            ]
        })
    ) file:Express.Multer.File){
        data.photo = file.buffer.toString('base64');
        try {
            const newUser:any = await this.UserService.createUser(data);
            return  newUser;
        } catch (error) {
            throw error;
        }

    }

    // @Roles(Role.Admin,Role.User)
    @Get('/all')
    async allUsers(){
        try {
            const result = await this.UserService.allUsers();
            return result;
        } catch (error) {
            throw error;
        }
    }

}
