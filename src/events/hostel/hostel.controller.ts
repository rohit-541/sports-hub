import { BadRequestException, Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { HostelService } from './hostel.service';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

@Controller('hostel')
export class HostelController {

    constructor(private hostelService:HostelService){}

    @Post('/')
    async createHostel(@Body('name') name:string){

        if(!name){
            throw new BadRequestException("Name is required");
        }

        try {
            const newHostel = await this.hostelService.createHostel(name);
            return  {
                        success:true,
                        Hostel:newHostel
                    }
        } catch (error) {
            if(error instanceof PrismaClientValidationError){
                throw new BadRequestException("Invalid Data");
            }
            
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == "P2002"){
                    throw new BadRequestException("Hostel already exists");
                }
            }

            throw new InternalServerErrorException("Something went Wrong");
        }
    }

    @Post('/addPoint/:id')
    async addpoint(@Body('points') points:number){
        
    }

}
