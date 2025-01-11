import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TeamsService } from '../teams/teams.service';


@Injectable()
export class MatchService {

    constructor(private prisma:PrismaService,
        private teamsService:TeamsService
    ){}

    //CRUD Match

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
                team1:true,
                team2:true,
                status:true,
                dateStart:true,
                dateEnd:true,
                winner:true,
                longitude:true,
                latitude:true,
                location:true,
                pool:true,
                scoreA:true,
                type:true,
                scoreB:true,
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
                latitude:true,
                location:true
            }
        });

        return result;
    }

    //Get winner
    winnerMatch = async(matchId:number)=>{
        const result = await this.prisma.match.findUnique({
            where:{
                id:matchId,
                status:"Completed"
            },
            select:{
                winner:true
            }
        });

        return result;
    }


    //Get Matches

    //Get next n Matches(n)
    async upcommingMatches(n:number){
        const result = await this.prisma.match.findMany({
            where:{
                dateStart:{
                    gte:new Date(Date.now() + 5.5*60*1000*60)
                }
            },
            take:n,
            orderBy:{
                dateEnd:'desc'
            }
        });

        return result;
    }

    //Get live matches
    async liveMatches(){

        await this.prisma.match.updateMany({
            where:{
                dateStart:{
                    lte:new Date(Date.now() + 5.5*60*1000*60)
                },
                dateEnd:{
                    gte:new Date(Date.now() + 5.5*60*1000*60)
                },
            },
            data:{
                status:"Ongoing"
            }
        });
        
        const result = await this.prisma.match.findMany({
            where:{
                dateStart:{
                    lte:new Date(Date.now() + 5.5*60*1000*60)
                },
                dateEnd:{
                    gte:new Date(Date.now() + 5.5*60*1000*60)
                },
            }
        });
        console.log(new Date(Date.now() + 5.5*60*1000*60));

        return result;
    }

    //Get past Matches(n)
    async pastMatch(n:number){
        const result = await this.prisma.match.findMany({
            where:{
                dateEnd:{
                    lte:new Date(Date.now() + 5.5*60*1000*60)
                }
            },
            take:n,
            orderBy:{
                dateEnd:'desc'
            }
        });

        return result;
    }

    //Filtering logic

    //Winner Section

    //Declare winner
    createWinner = async(matchId:number,winnerId:number)=>{
        const match = await this.prisma.match.findUnique({
            where:{
                id:matchId,
            },
        });

        if(!match){
            throw new BadRequestException("No Match with following id is found");
        }

        if(winnerId != match.team1Id && winnerId != match.team2Id){
            throw new BadRequestException("Team does not play in this Match")
        }

        const result = await this.prisma.match.update({
            where:{
                id:matchId
            },
            data:{
                winnerId:winnerId,
                status:"Completed"
            },
            select:{
                sport:true,
                status:true,
                winner:{
                    select:{
                        hostel:true
                    }
                },
            }
        });

        const team = await this.teamsService.updateScore(winnerId,1);


        return result;
    }


    //Score Section

    //Update score of match
    updateScore = async(matchId:number,data:any)=>{

        console.log(data.ScoreA);
        const result = await this.prisma.match.update({
            where:{
                id:matchId
            },
            data:{
                scoreA:Number(data.scoreA),
                scoreB:Number(data.scoreB)
            }
        });

        console.log(result);
        return result;
    }

     //Rounds

    //Create a round
    async createRound(data:any){
        const newRound = await this.prisma.round.create({
            data:data
        });
        
        return newRound;
    }

    //delete a round
    async deleteRound(roundId:number){
        const result = await this.prisma.round.delete({
            where:{
                id:roundId
            }
        });

        return result
    }

    //Update a round
    async updateRound(roundId:number,data:any){
        const result = await this.prisma.round.update({
            where:{
                id:roundId
            },
            data:data,
        }); 

        return result;
    }

    //Get details of a round
    async roundDetails(roundId:number){
        const result = await this.prisma.round.findUnique({
            where:{
                id:roundId
            }
        });

        return result;
    }

    //Set the winner of round
    async createRoundWinner(roundId:number,winnerId:number){
        const result = await this.prisma.round.update({
            where:{
                id:roundId
            },
            data:{
                winnerId:winnerId
            }
        });

        return result;
    }

    //Update the score of the round
    async updateRoundScore(roundId:number,scoreData:any){
        const result = await this.prisma.round.update({
            where:{
                id:roundId
            },
            data:scoreData
        });

        return result
    }

    //Get the winner of round
    async winnerRound(roundId:number){
        const result = await this.prisma.round.findUnique({
            where:{
                id:roundId
            }
        });

        return result;
    }

}
