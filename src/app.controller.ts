import { Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from '@prisma/client';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  getTest(): Promise<User[]> {
    return this.appService.getTest();
  }

  @Post()
  async example(@Res() res: Response) {
    const result = streamText({
      model: openai('gpt-4o'),
    });

    result.pipeDataStreamToResponse(res);
  }
}
