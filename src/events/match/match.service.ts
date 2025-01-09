import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class MatchService {

    constructor(private prisma:PrismaService){}

    //Create a Match
    createMatch = async(data:any)=>{
        const newMatch = await this.prisma.match.create({
            data:data
        });

        return newMatch;
    }
    //Delete a Match
    deleteMatch = async(matchId:number)=>{
        const result = await this.prisma.match.delete({
            where:{
                id:matchId
            }
        });

        return true;
    }

    //update a Match
    updateMatch = async(matchId:number,data:any)=>{
        const result = await this.prisma.match.update({
            where:{
                id:matchId
            },
            data:data
        });

        return result;
    }

    //Get a match details
    matchDetails = async(matchId:number)=>{
        const result = await this.prisma.match.findUnique({
            where:{
                id:matchId
            },
            select:{
                Team1:true,
                Team2:true,
                status:true,
                DateStart:true,
                DateEnd:true,
                WinnerTeam:true,
                longitude:true,
                latitude:true
            }
        });

        return result;
    }

    //Get next n Matches(n)
    async upcommingMatches(n:number){
        const result = await this.prisma.match.findMany({
            where:{
                DateStart:{
                    gte:new Date()
                }
            },
            take:n,
            orderBy:{
                DateEnd:'desc'
            }
        });

        return result;
    }

    //Get live matches
    async liveMatches(n:number){
        const result = await this.prisma.match.findMany({
            where:{
                DateEnd:{
                    gte:new Date()
                },
                DateStart:{
                    lte:new Date()
                }
            },
            take:n,
            orderBy:{
                DateEnd:'desc'
            }
        });

        return result;
    }

    //Get past Matches(n)
    async pastMatch(n:number){
        const result = await this.prisma.match.findMany({
            where:{
                DateEnd:{
                    lt:new Date("2025-04-18 16:00")
                }
            },
            take:n,
            orderBy:{
                DateEnd:'desc'
            }
        });

        return result;
    }
    //Declare winner
    createWinner = async(matchId:number,winnerId:number)=>{
        const match = await this.prisma.match.findUnique({
            where:{
                id:matchId
            }
        });

        if(!match){
            throw new BadRequestException("No Match with following id is found");
        }
        if(winnerId != match.team1 && winnerId != match.team2){
            throw new BadRequestException("Team does not play in this Match")
        }

        const result = await this.prisma.match.update({
            where:{
                id:matchId
            },
            data:{
                winner:winnerId,
                status:-1
            },
            select:{
                WinnerTeam:true
            }
        });

        return result;
    }

    //Get Location coordinates
    async location(matchId:number){
        const result = await this.prisma.match.findUnique({
            where:{
                id:matchId
            },
            select:{
                longitude:true,
                latitude:true
            }
        });

        return result;
    }

    //Get winner
    winnerMatch = async(matchId:number)=>{
        const result = await this.prisma.match.findUnique({
            where:{
                id:matchId
            },
            select:{
                WinnerTeam:true
            }
        });

        return result;
    }
}
