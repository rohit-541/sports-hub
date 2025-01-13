import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
  } from '@nestjs/common';
  import { OcmatchService } from './ocmatch.service';
  import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
  } from '@prisma/client/runtime/library';
import { Role, Roles, RolesGuard } from 'src/user/roles.gaurd';
import { AuthGuard } from 'src/Auth/auth.gaurd';
  
  @Controller('ocmatch')
  export class OcmatchController {
    constructor(private readonly matchService: OcmatchService) {}
  
    // Create an OC match
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Post('/')
    async createMatch(@Body() data: any) {
      try {
        const startDate = new Date(data.dateStart);
        const endDate = new Date(data.dateEnd);
  
        if (startDate > endDate) {
          throw new BadRequestException('End Date cannot be in Past');
        }
  
        data.dateStart = startDate;
        data.dateEnd = endDate;
  
        const match = await this.matchService.createOCMatch(data);
        return {
          success: true,
          match: match,
        };
      } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError) {
          throw new BadRequestException('Check your Ids');
        }
        if (error instanceof PrismaClientValidationError) {
          throw new BadRequestException('Invalid Data format');
        }
        throw error;
      }
    }

    // Delete an OCMatch
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Delete('/:id')
    async deleteMatch(@Param('id') id: any) {
      if (!id) {
        throw new BadRequestException('Invalid Match Id');
      }
  
      try {
        await this.matchService.deleteMatch(id);
        return {
          success: true,
          message: 'Deleted Successfully',
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          throw new BadRequestException('No Match with this Id found');
        }
        throw error;
      }
    }
  
    // Update an OC match
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Put('/:id')
    async updateMatch(@Body() data: any, @Param('id') id: any) {
      if (!id) {
        throw new BadRequestException('Invalid match id');
      }
  
      const startDate = new Date(data.dateStart);
      const endDate = new Date(data.dateEnd);
  
      if (startDate > endDate) {
        throw new BadRequestException('End Date cannot be in Past');
      }
  
      if (data.dateStart) {
        data.dateStart = startDate;
      }
      if (data.dateEnd) {
        data.dateEnd = endDate;
      }
  
      try {
        const result = await this.matchService.updateMatch(id, data);
        return {
          success: true,
          updatedMatch: result,
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new BadRequestException('No Team with following id found');
          }
        }
        if (error instanceof PrismaClientValidationError) {
          throw new BadRequestException('Invalid data format');
        }
        throw error;
      }
    }
  
    // Get Details of an OCMatch

    @Get('/:id')
    async matchDetails(@Param('id') id: any) {
      if (!id) {
        throw new BadRequestException('Invalid match id');
      }
  
      try {
        const result = await this.matchService.matchDetails(id);
        if (!result) {
          throw new BadRequestException('No Match with this Id found');
        }
        return {
          success: true,
          match: result,
        };
      } catch (error) {
        throw error;
      }
    }
  
    // Add a Team to OCMatch
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Post('/team/:id')
    async addTeams(@Param('id') id: any, @Body() data: any) {
      if (!id) {
        throw new BadRequestException('Invalid Match Id');
      }
  
      // We assume teamIds can be any (likely an array of IDs):
      const teamIds: any[] = data.teamIds;
      if (!teamIds) {
        throw new BadRequestException('Invalid Data format');
      }
  
      try {
        await this.matchService.addTeam(id, teamIds);
        return {
          success: true,
          message: 'Teams added successfully',
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new BadRequestException('No Team with following id found');
          }
        }
        if (error instanceof PrismaClientValidationError) {
          throw new BadRequestException('Invalid data format');
        }
        throw error;
      }
    }
  
    // Add Winners of an OCMatch
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Post('/winner/:id')
    async winnerTeam(@Param('id') id: any, @Body() data: any) {
      if (!id) {
        throw new BadRequestException('Invalid Match Id');
      }
  
      const teamIds: any[] = data.teamIds;
      if (!teamIds) {
        throw new BadRequestException('Invalid Data format');
      }
  
      try {
        await this.matchService.addWinner(id, teamIds);
        return {
          success: true,
          message: 'Winners added successfully',
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new BadRequestException('No Team with following id found');
          }
        }
        if (error instanceof PrismaClientValidationError) {
          throw new BadRequestException('Invalid data format');
        }
        throw error;
      }
    }
  
    // Delete a Winner of an OCMatch
    @Roles(Role.Admin)
    @UseGuards(AuthGuard,RolesGuard)
    @Delete('/winner/:id')
    async deleteWinner(@Param('id') id: any, @Body() data: any) {
      if (!id) {
        throw new BadRequestException('Invalid Match Id');
      }
  
      const winnerId: any = data.winnerId;
      if (!winnerId) {
        throw new BadRequestException('Invalid Data format');
      }
  
      try {
        await this.matchService.removeWinner(id, winnerId);
        return {
          success: true,
          message: 'Winner removed successfully',
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new BadRequestException('No Team with following id found');
          }
        }
        if (error instanceof PrismaClientValidationError) {
          throw new BadRequestException('Invalid data format');
        }
        throw error;
      }
    }
  
    // Get the Winners of an OCMatch
    @Get('/winner/:id')
    async winners(@Param('id') id: any) {
      if (!id) {
        throw new BadRequestException('Invalid match id');
      }
  
      try {
        const result = await this.matchService.winnerMatch(id);
        if (!result) {
          throw new BadRequestException('No Match with this Id found');
        }
        return {
          success: true,
          teams: result,
        };
      } catch (error) {
        throw error;
      }
    }
  
    // Get all Teams of an OCMatch
    @Get('/teams/:id')
    async allteams(@Param('id') id: any) {
      if (!id) {
        throw new BadRequestException('Invalid match id');
      }
  
      try {
        const result = await this.matchService.allTeams(id);
        if (!result) {
          throw new BadRequestException('No Match with this Id found');
        }
        return {
          success: true,
          teams: result,
        };
      } catch (error) {
        throw error;
      }
    }
  }
  