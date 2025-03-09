import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { EmailModule } from './email/email.module';
import { AudioParsingModule } from './audio-parsing/audio-parsing.module';
@Module({
  imports: [EmailModule, AudioParsingModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
