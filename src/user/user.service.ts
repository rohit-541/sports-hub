import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly Prisma: PrismaService) {}

  // createUser
  async createUser(userData: any) {
    try {
      const newUser = await this.Prisma.user.create({
        data: userData,
      });
      return newUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get all users
  async allUsers() {
    return this.Prisma.user.findMany({
      select: {
        id: true,
        name: true,
        kerbros: true,
      },
    });
  }
}
