import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class HostelService {

    constructor(private prisma:PrismaService){}

    async createHostel(name:any){
        const newHostel = await this.prisma.hostel.create({
            data:{
                hostelName:name
            }
        });

        return newHostel;
    }


}
