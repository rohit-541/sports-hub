import { BadRequestException, Injectable } from '@nestjs/common';
import { sportType } from '@prisma/client';
import { error } from 'console';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a team
  createTeam = async (data: any) => {
    // e.g. data: { poolId, hostelId, sport, ... }
    const { poolId, ...otherData } = data;

    const newTeam = await this.prisma.team.create({
      data:{
        Categeorys:{
          connect:[
            {
              id:poolId
            }
          ]
        },
        ...otherData
      }
     
    },);
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
        scores: newScore,
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
        id:true,
        hostel: {
          select:{
            hostelName:true
          }
        },
        sport: true,
        sportsType: true,
        Players: true,
      },
    });
    
    const resultDTO = result.map((team)=>({
      id:team.id,
      team:team.hostel?.hostelName,
      sport:team.sport,
      sportType:team.sportsType
    }))
    return resultDTO;
  };

  // Players

  // Add player
  addPlayer = async (teamId: any, playerId: any) => {

    const result = await this.prisma.team.update({
      where: { id: teamId },
      data: {
        Players:{
          connect:[
            {
              id:playerId
            }
          ]
        }
      },
      select: {
        Players: true,
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
        Players: {
          disconnect: [{ id: playerId }],
        },
      },
      select: {
        Players: true,
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
        Players: true,
      },
    });
    return result;
  };
}
