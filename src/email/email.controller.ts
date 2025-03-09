import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { User } from '@prisma/client';

@Controller('email')
export class EmailController {
  constructor(private readonly EmailService: EmailService) {}

  @Post()
  async sendEmail(@Body() body: any): Promise<boolean> {
    try {
      const response = await this.EmailService.sendEmail(
        'lucasbrumatti99@gmail.com',
        'Email subject',
        'Email parsed content',
        body.report,
      );
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
