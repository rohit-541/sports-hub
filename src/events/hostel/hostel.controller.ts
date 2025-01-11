import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { HostelService } from './hostel.service';

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
            console.log(error);
            console.log(error.code);
        }
    }

    @Post('/addPoint/:id')
    async addpoint(@Body('points') points:number){
        
    }

}
