import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { PrismaService } from '../prisma/prisma.service';
@Module({
  imports: [],
  controllers: [EmailController],
  providers: [EmailService, PrismaService],
})
export class EmailModule {}
