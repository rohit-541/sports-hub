import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateHostelDto, UpdateHostelDto, UpdateIndividualGameDto } from './Data-Validation';
import { Sports } from '@prisma/client';

@Injectable()
export class HostelService {
  constructor(private readonly prisma: PrismaService) {}

  //Array containing all Sports
  Sports:{name:Sports}[] = [
    { name: "Badminton" },
    { name: "Cricket" },
    { name: "Football" },
    { name: "Chess" },
    { name: "TT" },
    { name: "Volleyball" },
    { name: "Hockey" },
    { name: "Athletics" },
    { name: "Squash" },
    { name: "Weightlifting" }
  ];
  
  //Create a new Hostel
  async createHostel(data: CreateHostelDto) {

    //Create a New Hostel
    const newHostel = await this.prisma.hostel.create({
      data: {
        hostelName: data.name,
      }
    });

    // Create GamePoint Objects for it 
    this.Sports.forEach(async (sport)=>{
      const result = await this.prisma.gamePoint.create({
        data:{
          name:sport.name,
          hostelId:newHostel.id
        }
      });
    });

    return newHostel;
  }

  //add total points to hostel
  async addPoints(hostelId: any, points: number) {

    return this.prisma.hostel.update({
      where: { id: hostelId },
      data: {
        points: {
          increment: points,
        },
      },
    });
  }

  //Update Hostel Details
  async updateHostel(hostelId: any, data: UpdateHostelDto) {
    return this.prisma.hostel.update({
      where: { id: hostelId },
      data: {
        // If "data.name" is defined, set 'hostelName' to it
        ...(data.name && { hostelName: data.name }),
        // If "data.points" is defined, set 'points' to it (or you could increment)
        ...(data.points !== undefined && { points: data.points }),
      },
    });
  }

    //add total points to hostel
  async addGamePoint(hostelId: any, name:Sports,points: number) {

    const result = this.prisma.gamePoint.update({
      where: {
        hostelId_name:{
          hostelId:hostelId,
          name:name
        }
      },
      data: {
        points: {
          increment: points,
        },
      },
    });
    await this.addPoints(hostelId,points);

    return result;
  }

    //Update gamePoints

  async updateGame(hostelId:any,name:Sports,points:number){
    const result = await this.prisma.gamePoint.update({
      where:{
        hostelId_name:{
          hostelId:hostelId,
          name:name
        }
      },
      data:{
        points:points
      }
    });
    
    return result;
  }
  
  async allHostels(){
    const result = await this.prisma.hostel.findMany({
      orderBy:{
        points:'desc'
      }
    });

    return result;
  }

  async allHostelByGame(name:Sports){
    const result = await this.prisma.gamePoint.findMany({
      where:{
        name:name
      },
      select:{
        points:true,
        Hostel:{
          select:{
            hostelName:true
          }
        }
      },
      orderBy:{
        points:'desc'
      }
    });

    return result;
  }

  async hostelDetails(hostelId:string){
    console.log("Hi");
    console.log(hostelId);
    const result = await this.prisma.hostel.findUnique({
      where:{
        id:hostelId
      },
      select:{
        hostelName:true,
        points:true,
        GamePoints:{
          select:{
            name:true,
            points:true
          }
        }
      }
    });

    const resultDTO = {
      name:result.hostelName,
      TotalPoints:result.points,
      GamePoints:result.GamePoints.map((game)=>({
        name:game.name,
        points:game.points
      }))
    }

    return resultDTO;
  }


}
