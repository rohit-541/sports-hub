import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OcmatchService {

    constructor(private prisma:PrismaService){}

    //Create a OC match
    async createOCMatch(data:any){
        const newMatch = await this.prisma.oCMatch.create({
            data:data
        });

        return newMatch;
    }

    //Delete a OC Match
    async deleteMatch(matchId:number){
        const result = await this.prisma.oCMatch.delete({
            where:{
                id:matchId
            }
        });

        return result;
    }

    //Update a OC match
    async updateMatch(matchId:number,data:any){
        const result = await this.prisma.oCMatch.update({
            where:{
                id:matchId
            },
            data:data
        });

        return result;
    }
    //Get Details of OC Match
    async matchDetails(matchId:number){
        const result = await this.prisma.oCMatch.findUnique({
            where:{
                id:matchId
            },
            include:{
                teams:{
                    select:{
                        hostel:true,
                    }
                }
            }
        });

        return result;
    }

    //Add a Team to OC Match
    async addTeam(matchId:number,teamIds:number[]){
        const result = await this.prisma.oCMatch.update({
            where:{
                id:matchId
            },
            data:{
                teams:{
                    set:teamIds.map((id)=>{
                        console.log("adding Ids");
                        console.log(id);
                        return ({id})})
                }
            }
        });

        return result;
    }

    //Set rank of team
    async setRank(teamId:number,rank:number){
        const result = await this.prisma.team.update({
            where:{
                id:teamId
            },
            data:{
                rank:rank
            }
        });

        return result;
    }
    //Add Winners of OC Match
    //rank -> order in gc
    //Score->total quantity to store strength of team
    async addWinner(matchId:number,winnerIds:number[]){//(set the rank to team)

        winnerIds.forEach(async (id,index)=>{
            await this.setRank(id,index);
        })

        const result = await this.prisma.oCMatch.update({
            where:{
                id:matchId
            },
            data:{
                winners:{
                    set:winnerIds.map((id)=>({id}))
                    
                }
            }
        });

        return result;
    }

    //Delete a Winner of OC Match
    async removeWinner(matchId:number,winnerId:number){//(set the rank to team)

        const result = await this.prisma.oCMatch.update({
            where:{
                id:matchId
            },
            data:{
                winners:{
                    disconnect:[{
                        id:winnerId
                    }]   
                }
            }
        });

        return result;
    }
    //Get the Winners of OC Match(sorted based on Rank)
    async winnerMatch(matchId:number){
        const result = await this.prisma.oCMatch.findUnique({
            where:{
                id:matchId
            },
            include:{
                winners:{
                    orderBy:{
                        rank:'asc'
                    }
                }
            },
        });

        return result;
    }

    //Set the ranks
    async setRanks(teamIds: number[]) {
        try {
            // Validate all IDs before proceeding
            const validIds = await Promise.all(
                teamIds.map(async (id) => {
                    const team = await this.prisma.team.findUnique({ where: { id } });
                    if (!team) throw new Error(`Invalid team ID: ${id}`);
                    return id;
                })
            );
    
            // If all IDs are valid, update the ranks
            await Promise.all(
                validIds.map((id, index) => this.setRank(id, index))
            );
    
            return true; // Success
        } catch (error) {
            console.error(error.message);
            return false; // Indicate failure
        }
    }
    
    //Get the Teams
    async allTeams(matchId:number){
        const result = await this.prisma.oCMatch.findUnique({
            where:{
                id:matchId
            },
            select:{
                teams:{
                    select:{
                        players:true,
                        hostel:true
                    }, 
                },
            }
        });
        
        return result;
    }
}
