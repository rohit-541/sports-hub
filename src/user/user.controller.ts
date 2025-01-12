import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { UserService } from './user.service';
  import { userDTO } from './user.validation';
  
  @Controller('user')
  export class UserController {
    constructor(private readonly UserService: UserService) {}
  
    @UseInterceptors(FileInterceptor('image'))
    @UsePipes(new ValidationPipe())
    @Post('/register')
    async registerUser(@Body() data: userDTO) {
      try {
        // data is now basically an 'any' object
        const newUser: any = await this.UserService.createUser(data);
        return newUser;
      } catch (error) {
        throw error;
      }
    }
  
    @Get('/all')
    async allUsers() {
      try {
        const result = await this.UserService.allUsers();
        return result;
      } catch (error) {
        throw error;
      }
    }
  }
  