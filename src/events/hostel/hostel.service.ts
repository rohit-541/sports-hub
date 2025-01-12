import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateHostelDto, UpdateHostelDto } from './Data-Validation';

@Injectable()
export class HostelService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new Hostel
   */
  async createHostel(data: CreateHostelDto) {
    // In MongoDB, "id" is a string ObjectId behind the scenes
    // We store the hostelName from "data.name"
    return this.prisma.hostel.create({
      data: {
        hostelName: data.name,
      },
    });
  }

  /**
   * Add or increment points for a given Hostel
   */
  async addPoints(hostelId: any, points: number) {
    // "hostelId" is the string version of the Mongo ObjectId
    // We'll increment the 'points' field by the given 'points'
    return this.prisma.hostel.update({
      where: { id: hostelId },
      data: {
        points: {
          increment: points,
        },
      },
    });
  }

  /**
   * Optional: Update a hostel’s name or points
   */
  async updateHostel(hostelId: any, data: UpdateHostelDto) {
    return this.prisma.hostel.update({
      where: { id: hostelId },
      data: {
        // If "data.name" is defined, set 'hostelName' to it
        ...(data.name && { hostelName: data.name }),
        // If "data.points" is defined, set 'points' to it (or you could increment)
        ...(data.points !== undefined && { points: data.points }),
      },
    });
  }
}
