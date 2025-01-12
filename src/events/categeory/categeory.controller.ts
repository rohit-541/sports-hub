import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategeoryService } from './categeory.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Controller('categeory')
export class CategeoryController {
  constructor(private readonly catService: CategeoryService) {}

  // Create a Categeory
  @Post('/')
  async createCategeory(@Body() data: any) {
    try {
      const newCat = await this.catService.createCategeory(data);
      return {
        success: true,
        Categeory: newCat,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException('Cannot add duplicate Categeory');
      }
      if (error instanceof PrismaClientValidationError) {
        console.log(error);
        throw new BadRequestException('Invalid Categeory data');
      }
      throw error;
    }
  }

  // Delete a Categeory
  @Delete('/:id')
  async deleteCategeory(@Param('id') id: any) {
    // ID is now any (instead of string)
    if (!id) {
      throw new BadRequestException('Invalid Categeory Id');
    }

    try {
      await this.catService.deleteCategeory(id);
      return {
        success: true,
        message: 'Deleted Successfully',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // e.g., P2025 => record not found
        if (error.code === 'P2025') {
          throw new BadRequestException('No Categeory with this Id found');
        }
      }
      throw error;
    }
  }

  // Update a Categeory
  @Put('/:id')
  async updateCategeory(@Body() data: any, @Param('id') id: any) {
    if (!id) {
      throw new BadRequestException('Invalid Categeory Id');
    }

    try {
      const result = await this.catService.updateCategeory(id, data);
      return {
        success: true,
        updatedCategeory: result,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Categeory with this id not found');
        }
      }
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid Structure of Data');
      }
      throw error;
    }
  }

  // Categeory Details
  @Get('/:id')
  async categeoryDetails(@Param('id') id: any) {
    if (!id) {
      throw new BadRequestException('Invalid Categeory Id');
    }

    try {
      const result = await this.catService.categeoryDetail(id);
      return {
        success: true,
        Categeory: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('/addTeam/:id')
  async addTeam(@Param('id') id: any, @Body() data: any) {
    const teamId: any = data.id;

    if (!id || !teamId) {
      throw new BadRequestException('Invalid Ids');
    }

    try {
      await this.catService.addTeam(id, teamId);
      return {
        success: true,
        message: 'Team added successfully to Categeory',
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Categeory with this id not found');
        }
      }
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid Structure of Data');
      }
      throw error;
    }
  }

  // Create Winner
  @Post('/winner/:id')
  async createWinner(@Body() data: any, @Param('id') id: any) {
    const winners: string[] = data.winner;
    if (!winners) {
      throw new BadRequestException('Please provide valid data');
    }
    if (!id) {
      throw new BadRequestException('Invalid Categeory Id');
    }

    try {
      const result = await this.catService.createWinner(id, winners);
      return {
        success: true,
        winners: result,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Get winner
  @Get('/winner/:id')
  async winner(@Param('id') id: any) {
    if (!id) {
      throw new BadRequestException('Invalid Categeory Id');
    }

    try {
      const result = await this.catService.winner(id);
      return {
        success: true,
        response: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('/allMatches/:id')
  async allMatches(@Param('id') id: any) {
    if (!id) {
      throw new BadRequestException('Invalid Id');
    }
    // Implementation if needed
    return {
      success: true,
      message: 'Fetch all matches for this Categeory (Not yet implemented)',
    };
  }

  @Get('/allMatch/BySport')
  async allMatchBySport(@Body() data: any) {
    const sport = data.sport;
    console.log(sport);
    try {
      const result = await this.catService.CategeoryBySport(sport);
      return {
        success: true,
        Categeory: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('/Cat/all')
  async allCategeories() {
    try {
      const result = await this.catService.allCat();
      return {
        success: true,
        response: result,
      };
    } catch (error) {
      throw error;
    }
  }
}
