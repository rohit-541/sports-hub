import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class CategeoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teamService: TeamsService,
  ) {}

  // Create a Categeory
  async createCategeory(data: any) {
    // 'data' can be any shape (e.g., { sport: ..., name: ... })
    const newCat = await this.prisma.categeory.create({
      data: data,
    });
    return newCat;
  }

  // Delete a Categeory
  // catId is now 'any' (was string)
  async deleteCategeory(catId: any) {
    const result = await this.prisma.categeory.delete({
      where: {
        id: catId,
      },
    });
    return result;
  }

  // Update a Categeory
  async updateCategeory(catId: any, data: any) {
    const result = await this.prisma.categeory.update({
      where: {
        id: catId,
      },
      data: data,
    });
    return result;
  }

  // Get a Categeory Details
  async categeoryDetail(catId: any) {
    const result = await this.prisma.categeory.findUnique({
      where: {
        id: catId,
      },
      select: {
        name: true,
        sport: true,
        matches: true,
        teams: true,
      },
    });
    return result;
  }

  // Create/Update a Winner of Categeory
  async createWinner(catId: any, winners: any[]) {
  
    const result = await this.prisma.categeory.update({
      where: {
        id: catId,
      },
      data: {
        winnerTeams: {
          set: winners.map((winnerId) => ({
            id: winnerId,
          })),
        },
      },
      select: {
        winnerTeams: true,
        sport: true,
      },
    });

    //TO-DO
    winners.forEach((teamId)=>{
      
    });

    return result;
  }

  // Get the Winner of Categeory
  async winner(catId: any) {
    const result = await this.prisma.categeory.findUnique({
      where: {
        id: catId,
      },
      select: {
        name: true,
        sport: true,
        winnerTeams: true
      },
      
    });
    return result;
  }

  // Get all Categeory of a particular sport
  async CategeoryBySport(sport: any) {
    console.log(sport);
    const result = await this.prisma.categeory.findMany({
      where: {
        sport: sport,
      },
      select: {
        teams: true,
        matches: true,
      },
    });
    console.log(result);
    return result;
  }

  async addTeam(catId: any, teamId: any) {
    const result = await this.prisma.categeory.update({
      where: {
        id: catId,
      },
      data: {
        teams: {
          connect: [{ id: teamId }],
        },
      },
    });
    return result;
  }

  // Get all Categeories
  async allCat() {
    const result = await this.prisma.categeory.findMany({
      select: {
        id: true,
        teams: {
          select: {
            //  : {
            //   select: {
            //     hostelName: true,
            //   },
            // },
            
          },
        },
        name: true,
        sport: true,
        matches: {
          select: {
            team1: {
              select: {
                hostel: {
                  select: {
                    hostelName: true,
                  },
                },
              },
            },
            team2: {
              select: {
                hostel: {
                  select: {
                    hostelName: true,
                  },
                },
              },
            },
            scoreA: true,
            scoreB: true,
          },
        },
      },
    });

    // Convert the result into a friendlier DTO
    // const resultDTO = result.map((cat) => ({
    //   id: cat.id,
    //   name: cat.name,
    //   sport: cat.sport,
    //   // teams: cat.poolTeams.map((team) => ({
    //   //   Hostel: team.hostel.hostelName,
    //   //   Score: team.score,
    //   // })),
    //   // Matches: cat.matches.map((match) => ({
    //   //   teams: [
    //   //     match.team1?.hostel?.hostelName,
    //   //     match.team2?.hostel?.hostelName,
    //   //   ],
    //     scoreA: match.scoreA,
    //     scoreB: match.scoreB,
    //   })),
    // }));

    return result;
  }
}
