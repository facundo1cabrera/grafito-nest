import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Resend } from 'resend';
import * as puppeteer from 'puppeteer';

@Injectable()
export class EmailService {
  private readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  async sendEmail(
    emailReceiver: string,
    emailSubject: string,
    emailContent: string
  ): Promise<boolean> {

    if(!process.env.RESEND_API_KEY || !process.env.RESEND_SENDER_EMAIL)
        throw new Error('RESEND_API_KEY is undefined')

    const resend = new Resend(process.env.RESEND_API_KEY);

    const emailSender = process.env.RESEND_SENDER_EMAIL;

    // We need to decide what the templates for the email and pdf are going to be

    const pdfcontent = "<h1>This is the title</h1>";

    const pdf = await this.generatePdf(pdfcontent);

    const pdfBuffer = Buffer.from(pdf);
    
    resend.emails.send({
        from: emailSender,
        to: emailReceiver,
        subject: emailSubject,
        html: emailContent,
        attachments: [
          {
            content: pdfBuffer,
            filename: "report.pdf"
          }
        ]
      });

      return true;

  }

  private async generatePdf(
    htmlString: string
  ) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlString);
    const pdfBuffer = await page.pdf();
    await browser.close();
    return pdfBuffer;
  }

}
