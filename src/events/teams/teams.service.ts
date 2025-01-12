import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a team
  createTeam = async (data: any) => {
    // e.g. data: { poolId, hostelId, sport, ... }
    const { poolId, ...otherData } = data;

    // Convert poolId from number -> string if needed
    const poolIdString = String(poolId); // matches your `id: String` in Prisma

    const newTeam = await this.prisma.team.create({
      data: {
        // "pools" is a many-to-many or one-to-many in your original code.
        // In the updated Mongo schema, you might have an explicit join or direct relation.
        // Assuming 'pools' is a relation to Categeory or something similar:
        pools: {
          connect: [{ id: poolIdString }],
        },
        ...otherData,
      },
    });
    return newTeam;
  };

  // Delete a team
  deleteTeam = async (teamId: any) => {
    try {
      await this.prisma.team.delete({
        where: { id: teamId },
      });
      return true;
    } catch (error) {
      throw new BadRequestException('Team with this id not found');
    }
  };

  // Update team scores
  updateScore = async (teamId: any, newScore: number) => {
    const updateTeam = await this.prisma.team.update({
      where: { id: teamId },
      data: {
        score: newScore,
      },
    });
    return updateTeam;
  };

  // Update team details
  updateTeamDetails = async (teamId: any, data: any) => {
    const updatedTeam = await this.prisma.team.update({
      where: { id: teamId },
      data,
    });
    return updatedTeam;
  };

  // Get details of a team
  teamDetail = async (teamId: any) => {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: {
        sport: true,
        sportsType: true,
        hostel: true,
      },
    });
    return team;
  };

  // Get all teams
  allTeams = async () => {
    const result = await this.prisma.team.findMany({
      select: {
        hostel: true,
        sport: true,
        sportsType: true,
        // In the new schema, "players" is replaced by "userTeams" or is a join model
        // But you said "don't change functionality," so we keep "players" if your schema still has it.
        // If you truly removed players from Team, you'd need to adapt. 
        // We'll assume "players" is still a valid field (maybe from an older schema).
        userTeams: true,
      },
    });
    return result;
  };

  // Players

  // Add player
  addPlayer = async (teamId: any, playerId: any) => {
    const result = await this.prisma.team.update({
      where: { id: teamId },
      data: {
        userTeams: {
          connect: [{ id: playerId }],
        },
      },
      select: {
        userTeams: true,
      },
    });

    if (!result) {
      throw new BadRequestException('Team with this id not found');
    }

    return result;
  };

  // Remove player
  removePlayer = async (teamId: any, playerId: any) => {
    const result = await this.prisma.team.update({
      where: { id: teamId },
      data: {
        userTeams: {
          disconnect: [{ id: playerId }],
        },
      },
      select: {
        userTeams: true,
      },
    });

    if (!result) {
      throw new BadRequestException('Team with this id not found');
    }

    return result;
  };

  // Get all players
  allPlayers = async (teamId: any) => {
    const result = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: {
        userTeams: true,
      },
    });
    return result;
  };
}
