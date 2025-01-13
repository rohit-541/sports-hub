import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class MatchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teamsService: TeamsService,
  ) {}

  // Create a Match
  createMatch = async (data: any) => {
    return this.prisma.match.create({ data });
  };

  // Delete a Match
  deleteMatch = async (matchId: any) => {
    await this.prisma.match.delete({
      where: { id: matchId },
    });
    return true;
  };

  // Update a Match
  updateMatch = async (matchId: any, data: any) => {
    const result = await this.prisma.match.update({
      where: { id: matchId },
      data,
    });
    return result;
  };

  // Get a match details
  matchDetails = async (matchId: any) => {
    const result = await this.prisma.match.findUnique({
      where: { id: matchId },
      select: {
        id: true,
        team1: {
          select: {
            hostel: {
              select: {
                hostelName: true,
              },
            },
            // In your schema, there's no direct `players` field on Team, 
            // but we're keeping this for backward-compatibility:
            Players: true, 
          },
        },
        team2: {
          select: {
            hostel: {
              select: {
                hostelName: true,
              },
            },
            Players: true, 
          },
        },
        status: true,
        dateStart: true,
        dateEnd: true,
        winner: {
          select: {
            hostel: {
              select: {
                hostelName: true,
              },
            },
          },
        },
        sport: true,
        sportType: true,
        location: true,
        pool: true,
        scoreA: true,
        type: true,
        scoreB: true,
        rounds: true,
      },
    });

    if (!result) return null;

    // Transform to a friendlier DTO
    return {
      id: result.id,
      sport: result.sport,
      sportType: result.sportType,
      teamA: result.team1?.hostel?.hostelName,
      teamB: result.team2?.hostel?.hostelName,
      winner: result.winner?.hostel?.hostelName,
      venue: result.location,
      players1: result.team1?.Players,
      players2: result.team2?.Players,
      score: `${result.scoreA} - ${result.scoreB}`,
      rounds: result.rounds.map((round: any) => ({
        name: round.name,
        scoreA: round.scoreA,
        scoreB: round.scoreB,
      })),
    };
  };

  // Get location coordinates
  async location(matchId: any) {
    const result = await this.prisma.match.findUnique({
      where: { id: matchId },
      select: {
        longitude: true,
        latitude: true,
        location: true,
      },
    });
    return result;
  }

  // Get winner
  winnerMatch = async (matchId: any) => {
    const result = await this.prisma.match.findUnique({
      where: {
        id: matchId,
        // For Mongo, you can't do { id: matchId, status: "Completed" } as a single object 
        // for an AND condition. Typically you'd do a separate check or an AND query. 
        // We'll keep your logic, but note this might not filter by status in Mongo.
      },
      select: {
        winner: true,
        status: true,
      },
    });
    // If you wanted to ensure status is "Completed", you could check it manually
    if (result && result.status !== 'Completed') {
      return null;
    }
    return result;
  };

  // Get next n matches
  async upcommingMatches(n: number) {
    const upcoming = await this.prisma.match.findMany({
      where: {
        dateStart: {
          gte: new Date(Date.now() + 5.5 * 60 * 60 * 1000),
        },
      },
      orderBy: {
        dateEnd: 'desc',
      },
      take: n,
      select: {
        id: true,
        sport: true,
        sportType: true,
        dateStart: true,
        team1: {
          select: {
            hostel: {
              select: { hostelName: true },
            },
          },
        },
        team2: {
          select: {
            hostel: {
              select: { hostelName: true },
            },
          },
        },
      },
    });

    return upcoming.map((match: any) => ({
      id: match.id,
      sport: match.sport,
      sportType: match.sportType,
      date: match.dateStart.toISOString(),
      team1: match.team1?.hostel?.hostelName,
      team2: match.team2?.hostel?.hostelName,
    }));
  }

  // Get live matches
  async liveMatches() {
    // Mark relevant matches as Ongoing
    await this.prisma.match.updateMany({
      where: {
        dateStart: {
          lte: new Date(Date.now() + 5.5 * 60 * 60 * 1000),
        },
        dateEnd: {
          gte: new Date(Date.now() + 5.5 * 60 * 60 * 1000),
        },
      },
      data: {
        status: 'Ongoing',
      },
    });

    const result = await this.prisma.match.findMany({
      where: {
        dateStart: {
          lte: new Date(Date.now() + 5.5 * 60 * 60 * 1000),
        },
        dateEnd: {
          gte: new Date(Date.now() + 5.5 * 60 * 60 * 1000),
        },
      },
      select: {
        id: true,
        sport: true,
        sportType: true,
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
    });

    return result.map((match: any) => ({
      id: match.id,
      sport: match.sport,
      sportType: match.sportType,
      scores: `${match.scoreA} - ${match.scoreB}`,
      team1: match.team1?.hostel?.hostelName,
      team2: match.team2?.hostel?.hostelName,
    }));
  }

  // Get past matches(n)
  async pastMatch(n: number) {
    const past = await this.prisma.match.findMany({
      where: {
        dateEnd: {
          lte: new Date(Date.now() + 5.5 * 60 * 60 * 1000),
        },
      },
      orderBy: { dateEnd: 'desc' },
      take: n,
      select: {
        id: true,
        sport: true,
        sportType: true,
        scoreA: true,
        scoreB: true,
        team1: {
          select: {
            hostel: {
              select: { hostelName: true },
            },
          },
        },
        team2: {
          select: {
            hostel: {
              select: { hostelName: true },
            },
          },
        },
        dateEnd: true,
        winner: {
          select: {
            hostel: {
              select: { hostelName: true },
            },
          },
        },
      },
    });

    return past.map((match: any) => ({
      id: match.id,
      sport: match.sport,
      sportType: match.sportType,
      date: match.dateEnd.toISOString(),
      team1: match.team1?.hostel?.hostelName,
      team2: match.team2?.hostel?.hostelName,
      winner: match.winner?.hostel?.hostelName,
      scoreA: match.scoreA,
      scoreB: match.scoreB,
    }));
  }

  // Declare winner
  createWinner = async (matchId: any, winnerId: any) => {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });
    if (!match) {
      throw new BadRequestException('No Match with the provided id was found');
    }

    if (winnerId !== match.team1Id && winnerId !== match.team2Id) {
      throw new BadRequestException('Team does not play in this Match');
    }

    const result = await this.prisma.match.update({
      where: { id: matchId },
      data: {
        winnerId: winnerId,
        status: 'Completed',
      },
      select: {
        sport: true,
        status: true,
        winner: {
          select: { hostel: true },
        },
      },
    });

    // Increase winner team's score by 1
    await this.teamsService.updateScore(winnerId, 1);

    return result;
  };

  // Update score of match
  updateScore = async (matchId: any, data: any) => {
    const updated = await this.prisma.match.update({
      where: { id: matchId },
      data: {
        scoreA: Number(data.scoreA),
        scoreB: Number(data.scoreB),
      },
    });
    return updated;
  };

  // Rounds

  // Create a round
  async createRound(data: any,n:number) {
    const result = await this.prisma.round.create({
      data:data
    })

    for(let i = 0;i<n;i++){
      const dto = {
        name:`Set ${i}`,
        roundId:result.id
      }
      await this.prisma.stages.create({
        data:dto
      });
    }
  }

  // Delete a round
  async deleteRound(roundId: any) {
    const result = await this.prisma.round.delete({
      where: { id: roundId },
    });
    return result;
  }

  // Update a round
  async updateRound(roundId: any, data: any) {
    const result = await this.prisma.round.update({
      where: { id: roundId },
      data,
    });
    return result;
  }

  // Get details of a round
  async roundDetails(roundId: any) {
    const round = await this.prisma.round.findUnique({
      where: { id: roundId },
      select:{
        Stages:{
          select:{
            name:true,
            scoreA:true,
            scoreB:true
          }
        },
        scoreA:true,
        scoreB:true,
        name:true,
        Match:{
          select:{
            team1:{
              select:{
                hostel:{
                  select:{
                    hostelName:true,
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
          }
        }
      }
    });

    return {
      name:round.name,
      Sets:round.Stages.map((set)=>({
        name:set.name,
        scoreA:set.scoreA,
        scoreB:set.scoreB,
      })),
      scoreA:round.scoreA,
      scoreB:round.scoreB,
      TeamA:round.Match?.team1?.hostel?.hostelName,
      TeamB:round.Match?.team2?.hostel?.hostelName,
    }

  }

  // Get all rounds for a match
  async allRounds(matchId: any) {
    const result = await this.prisma.round.findMany({
      where: { matchId: matchId },
      select:{
        Stages:{
          select:{
            name:true,
            scoreA:true,
            scoreB:true
          }
        },
        scoreA:true,
        scoreB:true,
        name:true,
        Match:{
          select:{
            team1:{
              select:{
                hostel:{
                  select:{
                    hostelName:true,
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
          }
        }
      }
    });

    return  result.map((round)=>({
      name:round.name,
      Sets:round.Stages.map((set)=>({
        name:set.name,
        scoreA:set.scoreA,
        scoreB:set.scoreB,
      })),
      scoreA:round.scoreA,
      scoreB:round.scoreB,
      TeamA:round.Match?.team1?.hostel?.hostelName,
      TeamB:round.Match?.team2?.hostel?.hostelName,
    
    }));
  }

  // Set the winner of round
  async createRoundWinner(roundId: any, winnerId: any) {
    const result = await this.prisma.round.update({
      where: { id: roundId },
      data: {
        winnerId: winnerId,
      },
    });
    return result;
  }

  // Update the score of the round
  async updateRoundScore(roundId: any, scoreData: any) {
    const result = await this.prisma.round.update({
      where: { id: roundId },
      data: scoreData,
    });
    return result;
  }

  //Set the Set Scores(Set the scores of internal sets)
  async setScore(stageId:string,scoreA:number,scoreB:number){
    const result = await this.prisma.stages.update({
      where:{
        id:stageId
      },
      data:{
        scoreA:scoreA,
        scoreB:scoreB
      }
    });
    return result;
  }

  // Get the winner of round
  async winnerRound(roundId: any) {
    return this.prisma.round.findUnique({
      where: { id: roundId },
    });
  }

  // Get Matches based on filters
  async filterMatches(data: any) {
    const filter: any = {};

    if (data.sport) filter.sport = data.sport;
    if (data.sportType) filter.sportType = data.sportType;
    if (data.after) {
      filter.dateStart = { gte: new Date(data.after) };
    }
    if (data.before) {
      filter.dateStart = { lte: new Date(data.before) };
    }
    if (data.categeory) {
      filter.CategeoryID = data.categeory;
    }
    if (data.location) {
      filter.location = data.location;
    }

    // Find in the Match collection
    const result = await this.prisma.match.findMany({
      where: filter,
      include: {
        team1: true,
        team2: true,
        rounds: true,
      },
    });

    // Also find in the OCMatch collection with the same filter
    const result2 = await this.prisma.oCMatch.findMany({
      where: filter,
      include: {
        teams: {
          include: {
            hostel: true,
          },
        },
      },
    });

    return [...result, ...result2];
  }

}
