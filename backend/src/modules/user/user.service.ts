import { Injectable } from '@nestjs/common';

import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    name: string;
    email: string;
    password: string;
    isEmailVerified?: boolean;
  }) {
    return this.prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateRefreshToken(userId: string, hashedRt: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: hashedRt,
      },
    });
  }

  async removeRefreshToken(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
      },
    });
  }
}