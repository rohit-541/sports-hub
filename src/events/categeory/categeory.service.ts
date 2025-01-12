import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class CategeoryService {

    constructor(private prisma:PrismaService,
        private teamService:TeamsService
    ){}

    //Create a Categeory
    async createCategeory(data:any){
        const newCat = await this.prisma.categeory.create({
            data:data
        });

        return newCat;
    }

    //Delete a Categeory
    async deleteCategeory(catId:number){
        const result = await this.prisma.categeory.delete({
            where:{
                id:catId
            }
        });

        return result;
    }

    //Update a Categeory
    async updateCategeory(catId:number,data:any){
        const result = await this.prisma.categeory.update({
            where:{
                id:catId
            },
            data:data
        });

        return result
    }

    //Get a Categeory Details
    async categeoryDetail(catId:number){
        const result = await this.prisma.categeory.findUnique({
            where:{
                id:catId
            },
            select:{
                name:true,
                sport:true,
                matches:true,
                winners:true,
                teams:true,
            }
        });

        return result;
    }

    //Create/Update a Winner of Categeory
    async createWinner(catId:number,winners:any[]){
        const result = await this.prisma.categeory.update({
            where:{
                id:catId
            },
            data:{
                winners:{
                    set:winners.map(id=>({
                        id    
                    }))
                },
            },
            select:{
                winners:true,
                sport:true,
            },
        });

        
        winners.forEach(async (winner,index)=>{           
            await this.teamService.updateScore(winner,index*100);
        })
        
        return result;
    }

    //Get the Winner of Categeory
    async winner(catId:number){
        const result = await this.prisma.categeory.findUnique({
            where:{
                id:catId
            },
            select:{
                name:true,
                sport:true,
                winners:{
                    orderBy:{
                        score:'asc'
                    }
                },
            },
            
        });

        return result;
    }

    //Get all Categeory of sports
    async CategeoryBySport(sport:any){
        console.log(sport);
        const result = await this.prisma.categeory.findMany({
            where:{
                sport:sport
            },
            select:{
                teams:true,
                matches:true,
            }
        });

        console.log(result);
        return result;
    }

    async addTeam(CatId:number,teamId:number){
        const result = await this.prisma.categeory.update({
            where:{
                id:CatId
            },
            data:{
                teams:{
                    connect:[
                        {
                            id:teamId
                        }
                    ]
                }
            }
        });

        return result;
    }

    async allCat(){
        const result = await this.prisma.categeory.findMany({
            select:{
                id:true,
                teams:{
                    select:{
                        hostel:{
                            select:{
                                hostelName:true
                            }
                        },
                        score:true,
                    },
                },
                name:true,
                sport:true,
                matches:{
                    select:{
                        team1:{
                            select:{
                                hostel:true
                            }
                        },
                        team2:{
                            select:{
                                hostel:true
                            }
                        },
                        scoreA:true,
                        scoreB:true,
                    }
                },
            }
        });

        const resultDTO = result.map((cat)=>({
            id:cat.id,
            name:cat.name,
            sport:cat.sport,
            teams:cat.teams.map((team)=>(
                {
                    Hostel:team.hostel.hostelName,
                    Score:team.score
                })),
            Matches:cat.matches.map((match)=>(
                {
                    teams:[match.team1?.hostel?.hostelName,match.team2?.hostel?.hostelName],
                    scoreA:match.scoreA,
                    scoreB:match.scoreB
                }
            ))
        }))


        return resultDTO;
    }
}
