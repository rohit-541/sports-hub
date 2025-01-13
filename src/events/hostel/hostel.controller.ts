import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  Post,
  Patch,
  Put,
  Get,
  UseGuards,
} from '@nestjs/common';
import { HostelService } from './hostel.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CreateHostelDto, UpdateHostelDto, UpdateIndividualGameDto } from './Data-Validation';
import { Sports } from '@prisma/client';
import { Role, Roles, RolesGuard } from 'src/user/roles.gaurd';
import { AuthGuard } from 'src/Auth/auth.gaurd';


@Controller('hostel')
export class HostelController {
  constructor(private readonly hostelService: HostelService) {}

  //Create Hostel
  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  @Post('/')
  async createHostel(@Body() data: CreateHostelDto) {
    // We validate "data.name" using class-validator
    try {
      const newHostel = await this.hostelService.createHostel(data);
      return {
        success: true,
        hostel: newHostel,
      };
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid Data');
      }
      if (error instanceof PrismaClientKnownRequestError) {
        // e.g., "P2002" => unique constraint failed
        if (error.code === 'P2002') {
          throw new BadRequestException('Hostel already exists');
        }
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  @Post('/addPoint/:id')
  async addpoint(
    @Param('id') id: string,
    @Body('points') points: number,
  ) {
    if (!id) {
      throw new BadRequestException('Invalid Hostel ID');
    }
    if (!Number(points)) {
      throw new BadRequestException('Points are required');
    }
    try {
      const updatedHostel = await this.hostelService.addPoints(id, points);
      return {
        success: true,
        updatedHostel,
      };
    } catch (error) {
      // If the ID is invalid or not found, you might see a "P2025" error
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Hostel not found');
        }
        if(error.code == "P2023"){
          throw new BadRequestException("Invalid Id Provided");
        }
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  @Put('/:id')
  async updateHostel(@Param('id') id: string, @Body() data: UpdateHostelDto) {
    if (!id) {
      throw new BadRequestException('Invalid Hostel ID');
    }
    try {
      const updatedHostel = await this.hostelService.updateHostel(id, data);
      return {
        success: true,
        updatedHostel,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Hostel not found');
        }
      }
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid update data');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  @Put('/game/:id')
  async updateGamePoints(@Param('id') id:string,@Body() data:UpdateIndividualGameDto){

    try {
      const result = await this.hostelService.updateGame(id,data.name,data.points);
      return{
        success:true,
        resp:result
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Hostel not found');
        }
      }
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid update data');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard,RolesGuard)
  @Post('/addPoint/game/:id')
  async addGamePoint(
    @Param('id') id: string,
    @Body('points') points: number,
    @Body('name') name:Sports
  ) {
    if (!id) {
      throw new BadRequestException('Invalid Hostel ID');
    }
    if (!Number(points)) {
      throw new BadRequestException('Points are required');
    }

    if(!name){
      throw new BadRequestException("Name is Required");
    }

    try {
      const updatedHostel = await this.hostelService.addGamePoint(id,name,points);
      return {
        success: true,
        updatedHostel,
      };
    } catch (error) {
      // If the ID is invalid or not found, you might see a "P2025" error
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Hostel not found');
        }
        if(error.code == "P2023"){
          throw new BadRequestException("Invalid Id Provided");
        }
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Get('/')
  async allHostels(){
    try {
      const result = await this.hostelService.allHostels();
      return {
        success:true,
        Hostels:result
      }
    } catch (error) {
      throw error;
    }
  }

  @Get('/Sport/')
  async allHostelInSport(@Body('game') Game:Sports){
    if(!Game){
      throw new BadRequestException("Game Name is required");
    }

    try {
      const result = await this.hostelService.allHostelByGame(Game);
      return {
        success:true,
        Hostels:result.map((game)=>({
          name:game.Hostel?.hostelName,
          points:game.points
        }))
      }
    } catch (error) {
      throw new InternalServerErrorException("Something went wrong");
    }
  }

  @Get('/:id')
  async SingleHostel(@Param('id') hostelId:string){
    console.log("hey")
    try {
      const result = await this.hostelService.hostelDetails(hostelId);
      if(!result){
        throw new BadRequestException("No Hostel with this Id");
      }
      return {
        success:true,
        Hostel:result
      }
    } catch (error) {
      throw new InternalServerErrorException("Something went wrong");
    }
  }

}
