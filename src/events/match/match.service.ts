import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TeamsService } from '../teams/teams.service';
import { sportType } from '@prisma/client';


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
                id:true,
                team1:{
                    select:{
                        hostel:{
                            select:{
                                hostelName:true
                            }
                        },
                        players:true
                    }
                },
                team2:{
                    select:{
                        hostel:{
                            select:{
                                hostelName:true
                            }
                        },
                        players:true
                    }
                },
                status:true,
                dateStart:true,
                dateEnd:true,
                winner:{
                    select:{
                        hostel:{
                            select:{
                                hostelName:true
                            }
                        }
                    }
                },
                sport:true,
                sportType:true,
                location:true,
                pool:true,
                scoreA:true,
                type:true,
                scoreB:true,
                rounds:true
            }
        });

        const resultDTO = {
            id:result.id,
            sport:result.sport,
            sportType:result.sportType,
            teamA:result.team1?.hostel?.hostelName,
            teamB:result.team2?.hostel?.hostelName,
            winner:result.winner?.hostel?.hostelName,
            venue:result.location,
            players1:result.team1.players,
            players2:result.team2.players,
            score:`${result.scoreA} - ${result.scoreB}`,
            rounds:result.rounds.map((round)=>{
                return  {
                    name:round.name,
                    scoreA:round.scoreA,
                    scoreB:round.scoreB
                }
            })
        }
        return resultDTO;
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
            select:{
                id:true,
                sport:true,
                sportType:true,
                dateStart:true,
                team1:{
                    select:{
                        hostel:{
                            select:{
                                hostelName:true
                            }
                        }
                    }
                },
                team2:{
                    select:{
                        hostel:{
                            select:{
                                hostelName:true,
                            }
                        }
                    }
                }
            },
            orderBy:{
                dateEnd:'desc'
            }
        });

        // Map results to the desired format
        return result.map(match => ({
            id: match.id,
            sport: match.sport,
            sportType:match.sportType,
            date: new Date(match.dateStart).toISOString(),
            team1: match.team1?.hostel?.hostelName,
            team2: match.team2?.hostel?.hostelName,
        }));
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
            },
            select:{
                id:true,
                sport:true,
                sportType:true,
                team1:{
                    select:{
                        hostel:{
                            select:{
                                hostelName:true
                            }
                        }
                    }
                },
                team2:{
                    select:{
                        hostel:{
                            select:{
                                hostelName:true
                            }
                        }
                    }
                },
                scoreA:true,
                scoreB:true
            }
        });


        return result.map(match => ({
            id: match.id,
            sport:match.sport,
            sportType:match.sportType,
            scores: `${match.scoreA} - ${match.scoreB}`,
            team1: match.team1?.hostel?.hostelName,
            team2: match.team2?.hostel?.hostelName,
        }));
    }

    //Get past Matches(n)
    async pastMatch(n:number){
        const result = await this.prisma.match.findMany({
            where:{
                dateEnd:{
                    lte:new Date(Date.now() + 5.5*60*1000*60)
                }
            },
            orderBy:{
                dateEnd:'desc'
            },
            select:{
                id:true,
                sport:true,
                sportType:true,
                scoreA:true,
                scoreB:true,
                team1:{
                    select:{
                        hostel:{
                            select:{
                                hostelName:true
                            }
                        }
                    }
                },
                team2:{
                    select:{
                        hostel:{
                            select:{
                                hostelName:true
                            }
                        }
                    }
                },
                dateEnd:true,
                winner:{
                    select:{
                        hostel:{
                            select:{
                                hostelName:true
                            }
                        }
                    }
                }
            },
        });

        // Map results to the desired format
        return result.map(match => ({
            id: match.id,
            sport: match.sport,
            sportType:match.sportType,
            date: new Date(match.dateEnd).toISOString(),
            team1: match.team1?.hostel?.hostelName,
            team2: match.team2?.hostel?.hostelName,
            winner:match.winner?.hostel?.hostelName,
            scoreA:match.scoreA,
            scoreB:match.scoreB
        }));
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

    //Get all round corresponding to a round
    async allRounds(matchId:number){
        const result = await this.prisma.round.findMany({
            where:{
                matchId:matchId
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



    //Get Matches based on filters 
    async filterMatches(data:any){
        //Create a filter expression
        let filter:any = {};
        if(data.sport){
            filter.sport = data.sport;
        }

        if(data.sportType){
            filter.sportType = data.sportType
        }

        if(data.after){
            filter.dateStart = {
                gte: new Date(data.after)
            }
        }

        if(data.before){
            filter.dateStart = {
                lte:new Date(data.before)
            }
        }

        if(data.categeory){ //PoolA pool B ,quaters semifinals etc
            filter.CategeoryId == data.categeory
        }

        if(data.location){
            filter.location = data.location
        }

        const result = await this.prisma.match.findMany({
            where:filter,
            include:{
                team1:true,
                team2:true,
                rounds:true
            }
        });
        const result2 = await this.prisma.oCMatch.findMany({
            where:filter,
            include:{
                teams:{
                    include:{
                        hostel:true
                    }
                }
            }
        });
        const totalResult = [...result,...result2];
        return totalResult;

    }



}
