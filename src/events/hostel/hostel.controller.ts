import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  Post,
  Patch,
} from '@nestjs/common';
import { HostelService } from './hostel.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CreateHostelDto, UpdateHostelDto } from './Data-Validation';

@Controller('hostel')
export class HostelController {
  constructor(private readonly hostelService: HostelService) {}

  /**
   * Create a new Hostel
   */
  @Post('/')
  async createHostel(@Body() data: CreateHostelDto) {
    // We validate "data.name" using class-validator
    try {
      const newHostel = await this.hostelService.createHostel(data);
      return {
        success: true,
        hostel: newHostel,
      };
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid Data');
      }
      if (error instanceof PrismaClientKnownRequestError) {
        // e.g., "P2002" => unique constraint failed
        if (error.code === 'P2002') {
          throw new BadRequestException('Hostel already exists');
        }
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  /**
   * Increment points for a Hostel by ID
   */
  @Post('/addPoint/:id')
  async addpoint(
    @Param('id') id: string,
    @Body('points') points: number,
  ) {
    if (!id) {
      throw new BadRequestException('Invalid Hostel ID');
    }
    if (points === undefined) {
      throw new BadRequestException('Points are required');
    }
    try {
      const updatedHostel = await this.hostelService.addPoints(id, points);
      return {
        success: true,
        updatedHostel,
      };
    } catch (error) {
      // If the ID is invalid or not found, you might see a "P2025" error
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Hostel not found');
        }
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  /**
   * Optional: Update a Hostel's name or points
   */
  @Patch('/:id')
  async updateHostel(@Param('id') id: string, @Body() data: UpdateHostelDto) {
    if (!id) {
      throw new BadRequestException('Invalid Hostel ID');
    }
    try {
      const updatedHostel = await this.hostelService.updateHostel(id, data);
      return {
        success: true,
        updatedHostel,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Hostel not found');
        }
      }
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException('Invalid update data');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
