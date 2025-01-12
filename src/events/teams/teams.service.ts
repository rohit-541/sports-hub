import { BadRequestException, Get, Injectable, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TeamsService {

    constructor(private prisma:PrismaService){}

    //Create a team
    createTeam = async(data:any)=>{
        const {poolId,...otherData} = data;
        const newTeam = await this.prisma.team.create({
            data:{
                pools:{
                    connect:[
                        {id:poolId}
                    ]
                },
                ...otherData
            }
        });
        return newTeam;
    }

    //delete a team
    deleteTeam = async(teamId:number)=>{
        try {
            await this.prisma.team.delete({
                where:{
                    id:teamId
                }
            });
            return true;
        } catch (error) {
            throw new BadRequestException("Team with this id not found");
        }
    }

    //update team scores
    updateScore = async(teamsId:number,newScore:number)=>{
        console.log(newScore);
        const updateTeam = await this.prisma.team.update({
            where:{
                id:teamsId
            },
            data:{
                score:newScore
            }
        });

        console.log(updateTeam);
        return updateTeam;
    }

    //update team details
    updateTeamDetails = async(teamId:number,data:any)=>{
        const updatedTeam = await this.prisma.team.update({
            where:{
                id:teamId
            },
            data:data
        });
        return updatedTeam;
    }

    //get details of a team
    teamDetail = async(teamId:number)=>{
        const team = await this.prisma.team.findUnique({
            where:{
                id:teamId
            },
            select:{
                sport:true,
                sportsType:true,
                hostel:true,
            }
        });
        return team;
    }

    allTeams = async()=>{
        const result = await this.prisma.team.findMany({
            select:{
                hostel:true,
                sport:true,
                sportsType:true,
                players:true
            }
        });
        return result;
    }

    //Players

    //add Player
    addPlayer = async(teamsId:number,playerId:number)=>{
        const result = await this.prisma.team.update({
            where:{
                id:teamsId
            },
            data:{
                players:{
                    connect:[
                        {id:playerId}
                    ]
                }
            },
            select:{
                players:true
            }
        });

        if(!result){
            throw new BadRequestException("Team with this id not found");
        }

        return result;
    }

    //remove Player
    removePlayer = async(teamId:number,playerId:number)=>{
        const result = await this.prisma.team.update({
            where:{
                id:teamId
            },
            data:{
                players:{
                    disconnect:[
                        {id:playerId}
                    ]
                }
            },
            select:{
                players:true
            }
        });

        if(!result){
            throw new BadRequestException("Team with this id not found");
        }

        return result;
    }

    //Get all Players
    allPlayers = async(teamId:number)=>{
        const result = await this.prisma.team.findUnique({
            where:{
                id:teamId
            },
            select:{
                players:true
            }
        });

        return result;
    }

}
