import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  private readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  getHello(): string {
    return 'Hello World!';
  }

  getTest() {
    return this.prisma.user.findMany();
  }
}
