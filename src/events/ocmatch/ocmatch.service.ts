import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OcmatchService {
  constructor(private readonly prisma: PrismaService) {}

  // Create an OC match
  async createOCMatch(data: any) {
    const newMatch = await this.prisma.oCMatch.create({
      data: data,
    });
    return newMatch;
  }

  // Delete an OC Match
  async deleteMatch(matchId: any) {
    const result = await this.prisma.oCMatch.delete({
      where: {
        id: matchId,
      },
    });
    return result;
  }

  // Update an OC Match
  async updateMatch(matchId: any, data: any) {
    const result = await this.prisma.oCMatch.update({
      where: {
        id: matchId,
      },
      data: data,
    });
    return result;
  }

  // Get Details of OC Match
  async matchDetails(matchId: any) {
    const result = await this.prisma.oCMatch.findUnique({
      where: { id: matchId },
      include: {
        Team: {
          select: {
            hostel: true,
          },
        },
      },
    });
    return result;
  }

  // Add a Team to OC Match
  async addTeam(matchId: any, teamIds: any[]) {
    // 'set' overwrites existing teams. If you only want to add, consider 'connect' or 'push' logic.
    const result = await this.prisma.oCMatch.update({
      where: { id: matchId },
      data: {
        Team: {
          set: teamIds.map((t: any) => ({ id: t })),
        },
      },
    });
    return result;
  }

  // Set rank of team
  async setRank(teamId: any, rank: number) {
    const result = await this.prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        rank: rank,
      },
    });
    return result;
  }

  // Add Winners of OC Match
  async addWinner(matchId: any, winnerIds: any[]) {
    // Give each winner a rank = its index
    winnerIds.forEach(async (wid: any, index) => {
      await this.setRank(wid, index);
    });

    const result = await this.prisma.oCMatch.update({
      where: { id: matchId },
      data: {
        winners: {
          set: winnerIds.map((wid: any) => ({ id: wid })),
        },
      },
    });

    return result;
  }

  // Delete a Winner of OC Match
  async removeWinner(matchId: any, winnerId: any) {
    const result = await this.prisma.oCMatch.update({
      where: { id: matchId },
      data: {
        winners: {
          disconnect: [{ id: winnerId }],
        },
      },
    });
    return result;
  }

  // Get the Winners of OC Match (sorted by Rank)
  async winnerMatch(matchId: any) {
    const result = await this.prisma.oCMatch.findUnique({
      where: { id: matchId }
      // include: {
      //   // ocMatchWinners: {
      //   //   orderBy: {
      //   //     rank: 'asc',
      //   //   },
      //   },
      // },
    });
    return result;
  }

  // Set the ranks (optional utility)
  async setRanks(teamIds: any[]) {
    try {
      // Validate all IDs (which are typed as 'any' now)
      const validIds = await Promise.all(
        teamIds.map(async (tid: any) => {
          const team = await this.prisma.team.findUnique({ where: { id: tid } });
          if (!team) throw new Error(`Invalid team ID: ${tid}`);
          return tid;
        }),
      );

      // If valid, update
      await Promise.all(validIds.map((tid: any, index) => this.setRank(tid, index)));
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  // Get all teams of an OC Match
  async allTeams(matchId: any) {
    const result = await this.prisma.oCMatch.findUnique({
      where: { id: matchId },
      select: {
        teams: {
          // select: {
          //   : true, // not in your schema, but kept for consistency
          //   hostel: true,
          // },
        },
      },
    });
    return result;
  }
}
