import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  sendEmail(
    emailReceiver: string,
    emailSubject: string,
    emailContent: string
  ): boolean {

    if(!process.env.RESEND_API_KEY || !process.env.RESEND_SENDER_EMAIL)
        throw new Error('RESEND_API_KEY is undefined')

    const resend = new Resend(process.env.RESEND_API_KEY);

    const emailSender = process.env.RESEND_SENDER_EMAIL;
    
    resend.emails.send({
        from: emailSender,
        to: emailReceiver,
        subject: emailSubject,
        html: emailContent
      });

      return true;

  }

}
