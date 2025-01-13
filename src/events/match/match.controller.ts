import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param,
    Post,
    Put,
    UseGuards,
  } from '@nestjs/common';
  import { AuthGuard } from 'src/Auth/auth.gaurd';
  import { MatchDto, ScoreDto, updateDto, winnerDto } from './Data-Validation';
  import { MatchService } from './match.service';
  import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
  } from '@prisma/client/runtime/library';
  
  @UseGuards(AuthGuard)
  @Controller('match')
  export class MatchController {
    constructor(private readonly matchService: MatchService) {}
  
    // Create a Match
    @Post('/')
    async createMatch(@Body() data: MatchDto) {
      try {
        // Convert your numeric fields to any or keep them as raw data
        data.team1Id = data.team1Id;
        data.team2Id = data.team2Id;
        data.CategeoryID = data.CategeoryID;
  
        // Validate date format
        const startDate = new Date(data.dateStart);
        const endDate = new Date(data.dateEnd);
        if (startDate > endDate) {
          throw new BadRequestException('End Date cannot be in the past');
        }
        data.dateStart = startDate;
        data.dateEnd = endDate;
  
        const newMatch = await this.matchService.createMatch(data);
        return newMatch;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2003') {
            throw new BadRequestException('Please Check Ids');
          }
        }
        if (error instanceof PrismaClientValidationError) {
          throw new BadRequestException('Invalid Structure of Data');
        }
        throw error;
      }
    }
  
    // Delete a match
    @Delete('/:id')
    async deleteMatch(@Param() params: any) {
      const matchId: any = params.id;
      if (!matchId) {
        throw new BadRequestException('Invalid Match Id');
      }
  
      try {
        await this.matchService.deleteMatch(matchId);
        return {
          success: true,
          message: 'Match deleted Successfully',
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new BadRequestException('No Match with this Match Id found');
          }
        }
      }
    }
  
    // Update details of match
    @Put('/:id')
    async updateMatchDetails(@Body() data: updateDto, @Param() params: any) {
      const matchId: any = params.id;
      if (!matchId) {
        throw new BadRequestException('Invalid Match Id');
      }
  
      if (data.dateStart) data.dateStart = new Date(data.dateStart);
      if (data.dateEnd) data.dateEnd = new Date(data.dateEnd);
      if (data.dateStart && data.dateEnd && data.dateStart > data.dateEnd) {
        throw new BadRequestException('End Date cannot be in the past');
      }
  
      try {
        const updatedMatch = await this.matchService.updateMatch(matchId, data);
        return {
          success: true,
          updatedMatch: updatedMatch,
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new BadRequestException('Match with this id not found');
          }
        }
        if (error instanceof PrismaClientValidationError) {
          throw new BadRequestException('Invalid Structure of Data');
        }
        return error;
      }
    }
  
    // Mark winner
    @Put('/winner/:id')
    async createWinner(@Body() data: winnerDto, @Param() params: any) {
      const matchId: any = params.id;
      if (!matchId) {
        throw new BadRequestException('Invalid Match Id');
      }
      const winnerId: any = data.winner;
      if (!winnerId) {
        throw new BadRequestException('Invalid Winner Id');
      }
  
      try {
        const result = await this.matchService.createWinner(matchId, winnerId);
        return {
          success: true,
          winner: result,
        };
      } catch (error) {
        throw error;
      }
    }
  
    // Get winner
    @Get('/winner/:id')
    async winnerMatch(@Param() params: any) {
      const matchId: any = params.id;
      if (!matchId) {
        throw new BadRequestException('Invalid Match Id');
      }
  
      const result = await this.matchService.winnerMatch(matchId);
      if (!result) {
        throw new BadRequestException('No Completed Match with this Id found!');
      }
  
      return {
        success: true,
        winner: result.winner,
      };
    }
  
    // Get match details
    @Get('/:id')
    async matchDetails(@Param() params: any) {
      const matchId: any = params.id;
      if (!matchId) {
        throw new BadRequestException('Invalid Match Id');
      }
  
      try {
        const result = await this.matchService.matchDetails(matchId);
        if (!result) {
          throw new BadRequestException('No Match with this Id found!');
        }
        return {
          success: true,
          Match: result,
        };
      } catch (error) {
        throw error;
      }
    }
  
    // Get next n matches
    @Get('/matches/upcomming')
    async upcommingMatch(@Body() data: any) {
      const n: number = Number(data.n) || 2;
      const result = await this.matchService.upcommingMatches(n);
      return {
        success: true,
        matches: result,
      };
    }
  
    // Get live matches
    @Get('/matches/live')
    async liveMatch(@Body() data: any) {
      const n: number = Number(data.n) || 2;
      const result = await this.matchService.liveMatches();
      return {
        success: true,
        matches: result,
      };
    }
  
    // Get past matches
    @Get('/matches/past')
    async pastMatch(@Body() data: any) {
      const n: number = Number(data.n) || 2;
      const result = await this.matchService.pastMatch(n);
      return {
        success: true,
        matches: result,
      };
    }
  
    @Get('/location/:id')
    async matchLocation(@Param() params: any) {
      const matchId: any = params.id;
      if (!matchId) {
        throw new BadRequestException('Invalid Match Id');
      }
  
      const result: any = await this.matchService.location(matchId);
      if (!result) {
        throw new BadRequestException('No Match with following Id is found!');
      }
      return {
        success: true,
        location: result,
      };
    }
  
    @Put('/score/:id')
    async updateScore(@Body() data: ScoreDto, @Param('id') id: any) {
      const matchId: any = id;
      if (!matchId) {
        throw new BadRequestException('Invalid Match Id');
      }
  
      try {
        await this.matchService.updateScore(matchId, data);
        return {
          success: true,
          Message: 'Score Updated Successfully',
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new BadRequestException('No Match with this Id found');
          }
        }
      }
    }



    //-------------------
    //    Rounds        |
    //-------------------
    
    // Create a round
    @Post('/round/')
    async createRound(@Body() data: any) {
      try {
        if (data.matchId) data.matchId = data.matchId; 
        let {n,...otherdata} = data;
        n = Number(n)||3;

        const result = await this.matchService.createRound(otherdata,n);
        return {
          success: true,
          round: result,
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2003') {
            throw new BadRequestException('Match does not exist');
          }
          if (error.code === 'P2002') {
            throw new BadRequestException('Round with these details already exist');
          }
        }

        if(error instanceof PrismaClientValidationError){
          throw new BadRequestException("Data format provided is not valid!")
        }

        throw new InternalServerErrorException("Something went wrong");
      }
    }
  
    // Delete a round
    @Delete('/round/:id')
    async deleteRound(@Param('id') id: any) {
      const roundId: any = id;
      if (!roundId) {
        throw new BadRequestException('Invalid Round Id');
      }
      try {
        await this.matchService.deleteRound(roundId);
        return {
          success: true,
          message: 'Round Deleted Successfully',
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new BadRequestException('No Round with following id found');
          }
          if(error.code == "P2023"){
            throw new BadRequestException("Invalid Id");
          }
        }
        throw new InternalServerErrorException("Something went Wrong");
      }
    }
  
    // Update a round
    @Put('/round/:id')
    async updateRound(@Body() data: any, @Param('id') id: any) {
      const roundId: any = id;
      if (!roundId) {
        throw new BadRequestException('Invalid Round Id');
      }
  
      try {
        await this.matchService.updateRound(roundId, data);
        return {
          success: true,
          message: 'Updated Successfully',
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new BadRequestException('No Round with the following id found');
          }
          if (error.code === 'P2002') {
            throw new BadRequestException('Round with these details already exist');
          }
          if(error.code == "P2023"){
            throw new BadRequestException("Invalid Id Provided");
          }
        }
        if (error instanceof PrismaClientValidationError) {
          throw new BadRequestException('Invalid data format');
        }
        throw error;
      }
    }
  
    @Get('/round/all/:id')
    async allRound(@Param('id') id: any) {
      const matchId: any = id;
      if (!matchId) {
        throw new BadRequestException('Invalid Match Id');
      }
  
      try {
        const result = await this.matchService.allRounds(matchId);
        return {
          success: true,
          rounds: result,
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          throw new BadRequestException('No Match with this Id found');
        }
        throw error;
      }
    }
  
    // Get details of a round
    @Get('/round/:id')
    async roundDetails(@Param('id') id: any) {
      const roundId: any = id;
      if (!roundId) {
        throw new BadRequestException('Invalid Round Id');
      }
  
      try {
        const result = await this.matchService.roundDetails(roundId);
        if (!result) {
          throw new BadRequestException('No round with this Id found');
        }
        return {
          success: true,
          Round: result,
        };
      } catch (error) {
        throw error;
      }
    }
  
    // Set the winner of round
    @Post('/round/winner/:id')
    async setWinner(@Param('id') id: any, @Body() data: any) {
      const roundId: any = id;
      if (!roundId) {
        throw new BadRequestException('Invalid Round Id');
      }
      const winnerId: any = data.winnerId;
      if (!winnerId) {
        throw new BadRequestException('Invalid winner Id');
      }
  
      try {
        await this.matchService.createRoundWinner(roundId, winnerId);
        return {
          success: true,
          message: 'Winner Set Successfully',
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2003') {
            throw new BadRequestException('No Team with this Id exists');
          }
          if (error.code === 'P2025') {
            throw new BadRequestException('No Round with this id exists');
          }
        }
        throw error;
      }
    }
  
    // Update the score of the round
    @Put('/round/score/:id')
    async setScore(@Param('id') id: any, @Body() data: any) {
      const roundId: any = id;
      if (!roundId) {
        throw new BadRequestException('Invalid Round Id');
      }
  
      try {
        await this.matchService.updateRoundScore(roundId, data);
        return {
          success: true,
          message: 'Score Updated Successfully',
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new BadRequestException('No Round found with this Id');
          }
        }
        if (error instanceof PrismaClientValidationError) {
          throw new BadRequestException('Invalid data format');
        }
        throw error;
      }
    }
  
    @Post('/set/score/:id')
    async setScoreSet(@Param('id') id:string,@Body('scoreA') scoreA:number,@Body('scoreB') scoreB:number){
      scoreA = Number(scoreA);
      scoreB = Number(scoreB);

      if(!scoreA || !scoreB){
        throw new BadRequestException("Invalid Scores");
      }

      try {
        const result = await this.matchService.setScore(id,scoreA,scoreB);
        return {
          success:true,
          message:"Updated Successfully"
        }
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new BadRequestException('No Round with the following id found');
          }
          if (error.code === 'P2002') {
            throw new BadRequestException('Round with these details already exist');
          }
          if(error.code == "P2023"){
            throw new BadRequestException("Invalid Id Provided");
          }
        }
        if (error instanceof PrismaClientValidationError) {
          throw new BadRequestException('Invalid data format');
        }
        throw new InternalServerErrorException("Something went wrong");
      }


      

    }


    // Get the winner of round
    @Get('/round/winner/:id')
    async roundWinner(@Param('id') id: any) {
      const roundId: any = id;
      if (!roundId) {
        throw new BadRequestException('Invalid Round Id');
      }
  
      try {
        const result = await this.matchService.winnerRound(roundId);
        if (!result) {
          throw new BadRequestException('No Round with this ID exists');
        }
        return {
          success: true,
          winner: result,
        };
      } catch (error) {
        throw error;
      }
    }
  
    // Filtering
    @Get('/matches/filter')
    async filterMatchs(@Body() data: any) {
      try {
        // If data.categeory is numeric or something else, we do not enforce string
        // because we use "any" now
        const result = await this.matchService.filterMatches(data);
        return {
          success: true,
          matchs: result,
        };
      } catch (error) {
        throw error;
      }
    }

  }
  