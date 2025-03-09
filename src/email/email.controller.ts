import { Controller, Get, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { User } from '@prisma/client';

@Controller('email')
export class EmailController {
  constructor(private readonly EmailService: EmailService) {}

  @Post()
  sendEmail(): boolean {
    return this.EmailService.sendEmail(
        "cabrera.franco@yahoo.com.ar",
        "Email subject",
        "Email parsed content"
    );
  }
}