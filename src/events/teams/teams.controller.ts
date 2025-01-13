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
  import { teamDto, updateDto } from './data-validation';
  import { TeamsService } from './teams.service';
  import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
  } from '@prisma/client/runtime/library';
  
  @UseGuards(AuthGuard)
  @Controller('teams')
  export class TeamsController {
    constructor(private readonly teamsService: TeamsService) {}
    

    //CRUD TEAM

    //Create a Team
    @Post('/create')
    async createTeam(@Body() data: teamDto) {
      try {
        // If "data.poolId" is numeric, convert to string
        data.poolId = data.poolId;
  
        // If "data.hostelId" is numeric, convert to string
        data.hostelId = String(data.hostelId);
  
        // etc. for any other numeric IDs
        const newTeam = await this.teamsService.createTeam(data);
        return newTeam;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2003') {
            throw new BadRequestException('Hostel Does not exist');
          }else if(error.code == "P2023"){
            throw new BadRequestException("Invalid Id Provided");
          }else if(error.code == "P2025"){
            throw new BadRequestException("Data do not exists");
          }
          throw new BadRequestException('Cannot add duplicate Team');
        }
        if (error instanceof PrismaClientValidationError) {
          throw new BadRequestException('Invalid Team data');
      }
      throw error;
     } 
    }

    // Delete a team
    @Delete('/:id')
    async deleteTeam(@Param() data: any) {
      const teamIdStr = String(data.id); // parse param as string
  
      if (!teamIdStr) {
        throw new BadRequestException('Invalid Team Id');
      }
  
      const result = await this.teamsService.deleteTeam(teamIdStr);
      if (result) {
        return {
          success: true,
          message: 'Team deleted Successfully',
        };
      }
    }
  
    // Update details of team
    @Put('/update/:id')
    async updateTeam(@Param() params: any, @Body() data: updateDto) {
      const teamIdStr = String(params.id);
      if (!teamIdStr) {
        throw new BadRequestException('Invalid Team Id');
      }
  
      try {
        // If data has numeric IDs, convert them as needed
        if (data.hostel) {
          data.hostel = String(data.hostel);
        }
  
        const updatedTeam = await this.teamsService.updateTeamDetails(
          teamIdStr,
          data,
        );
        return {
          success: true,
          message: 'Updated Successfully',
          updatedTeam: updatedTeam,
        };
      } catch (error) {
        console.log(error)
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new BadRequestException('Cannot add duplicate Team');
          } else if (error.code === 'P2025') {
            throw new BadRequestException('Team with this id not found');
          } else if (error.code === 'P2003') {
            throw new BadRequestException('Hostel with this id not found');
          }else if(error.code == "P2023"){
            throw new BadRequestException("Invalid Id");
          }
        }
        if (error instanceof PrismaClientValidationError) {
          throw new BadRequestException('Invalid Team data');
        }
  
        throw error;
      }
    }
  
    // Get details of team
    @Get('/:id')
    async teamDetail(@Param() param: any) {
      const teamIdStr = String(param.id);
      if (!teamIdStr) {
        throw new BadRequestException('Invalid Team Id');
      }
  
      try {
        const team = await this.teamsService.teamDetail(teamIdStr);
        if (!team) {
          throw new BadRequestException('Team with this id not found');
        }
        return {
          success: true,
          team: team,
        };
      } catch (error) {
        if(error instanceof PrismaClientKnownRequestError){
          throw new BadRequestException("Invalid Id");
        }

        throw new InternalServerErrorException("Something went wrong");
      }
    }
  
    @Get('/')
    async allTeams() {
    
      try {
        const result = await this.teamsService.allTeams();
        return {
          success: true,
          Teams: result,
        };
      } catch (error) {
        throw new InternalServerErrorException("Something went Wrong");
      }
    }
  

    //SCORE
    @Put('/score/:id')
    async updateScore(@Body() data: any, @Param('id') id: any) {
      // parse the score as a number
      const score = Number(data.score);
      if (isNaN(score)) {
        throw new BadRequestException('Invalid Scores');
      }
  
      const teamIdStr = String(id);
      if (!teamIdStr) {
        throw new BadRequestException('Invalid Team Id');
      }
  
      try {
        await this.teamsService.updateScore(teamIdStr, score);
        return {
          success: true,
          message: 'Score Updated Successfully',
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new BadRequestException('The Team not found');
          }
        }
        throw error;
      }
    }
  
  
    
    // Players
    //Details of Player
    @Post('/addPlayer/:id')
    async addPlayer(@Body() data: any, @Param() params: any) {
      // parse IDs as strings
      const playerIdStr = String(data.id);
      const teamIdStr = String(params.id);
  
      if (!playerIdStr) {
        throw new BadRequestException('Invalid Player Id');
      }
      if (!teamIdStr) {
        throw new BadRequestException('Invalid Team Id');
      }
  
      try {
        const updatedTeam = await this.teamsService.addPlayer(
          teamIdStr,
          playerIdStr,
        );
        return updatedTeam;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2003') {
            throw new BadRequestException('Player Does not exist');
          }else if(error.code == "P2023"){
            throw new BadRequestException("Invalid Id Provided");
          }else if(error.code == "P2025"){
            throw new BadRequestException("Data do not exists");
          }
          console.log(error);
          throw new BadRequestException('Cannot add duplicate Player');
        }
        if (error instanceof PrismaClientValidationError) {
          throw new BadRequestException('Invalid Player data');
      }
      throw error;
      }
    }
  
    @Delete('/removePlayer/:id')
    async deletePlayer(@Body() data: any, @Param() params: any) {
      const playerIdStr = String(data.id);
      const teamIdStr = String(params.id);
  
      if (!playerIdStr) {
        throw new BadRequestException('Invalid Player Id');
      }
      if (!teamIdStr) {
        throw new BadRequestException('Invalid Team Id');
      }
  
      try {
        const updatedTeam = await this.teamsService.removePlayer(
          teamIdStr,
          playerIdStr,
        );
        return updatedTeam;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new BadRequestException('Player with this ID not found');
          }
          if (error.code === 'P2016') {
            throw new BadRequestException('Team with this ID not found');
          }
        }
        throw error;
      }
    }
  
    @Get('/players/:id')
    async allPlayers(@Param() data: any) {
      const teamIdStr = String(data.id);
      if (!teamIdStr) {
        throw new BadRequestException('Invalid Team Id');
      }
   
     try {
        const result = await this.teamsService.allPlayers(teamIdStr);
        if(!result){
          throw new BadRequestException("No Team with this Id");
        }

        return {
          success: true,
          players: result,
        };
     } catch (error) {

      if(error instanceof PrismaClientKnownRequestError){
        throw new BadRequestException("Invalid Ids");
      }
      throw error
     }
    }

  }
  