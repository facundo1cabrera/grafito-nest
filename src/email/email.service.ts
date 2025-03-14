import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Resend } from 'resend';
import * as puppeteer from 'puppeteer';
import { reportSchema } from '../zod.schemas';
import { z } from 'zod';
@Injectable()
export class EmailService {
  private readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  async sendEmail(
    emailReceiver: string,
    emailSubject: string,
    emailContent: string,
    report: z.infer<typeof reportSchema>,
  ): Promise<boolean> {
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_SENDER_EMAIL)
      throw new Error('RESEND_API_KEY is undefined');

    const resend = new Resend(process.env.RESEND_API_KEY);

    const emailSender = process.env.RESEND_SENDER_EMAIL;

    // We need to decide what the templates for the email and pdf are going to be

    const pdfcontent = '<h1>This is the title</h1>';

    // const pdf = await this.generatePdf(pdfcontent);

    // const pdfBuffer = Buffer.from(pdf);

    resend.emails.send({
      from: emailSender,
      to: emailReceiver,
      subject: emailSubject,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h1 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
          Interview Report
        </h1>

        <!-- Candidate Information -->
        <div style="padding: 20px; background: #f9f9f9; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="color: #2c5282; margin-bottom: 15px;">Candidate Information</h2>
          <p><strong>Name:</strong> ${report.interview.candidateName}</p>
          <p><strong>Position:</strong> ${report.interview.position}</p>
          <p><strong>Date:</strong> ${report.interview.date}</p>
          ${report.interview.duration ? `<p><strong>Duration:</strong> ${report.interview.duration} minutes</p>` : ''}
        </div>

        <!-- Scores -->
        <div style="padding: 20px; background: #f9f9f9; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="color: #2c5282; margin-bottom: 15px;">Performance Scores</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            <div style="text-align: center; padding: 10px; background: #fff; border-radius: 4px;">
              <div style="font-size: 24px; font-weight: bold; color: #2c5282;">${report.analysis.technicalScore}/10</div>
              <div>Technical</div>
            </div>
            <div style="text-align: center; padding: 10px; background: #fff; border-radius: 4px;">
              <div style="font-size: 24px; font-weight: bold; color: #2c5282;">${report.analysis.communicationScore}/10</div>
              <div>Communication</div>
            </div>
            <div style="text-align: center; padding: 10px; background: #fff; border-radius: 4px;">
              <div style="font-size: 24px; font-weight: bold; color: #2c5282;">${report.analysis.problemSolvingScore}/10</div>
              <div>Problem Solving</div>
            </div>
          </div>
        </div>

        <!-- Technical Assessment -->
        <div style="padding: 20px; background: #f9f9f9; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="color: #2c5282; margin-bottom: 15px;">Technical Assessment</h2>
          <p><strong>Technical Concepts:</strong> ${report.analysis.technicalConcepts.join(', ')}</p>
          <h3 style="color: #2c5282; margin-top: 15px;">Key Takeaways</h3>
          <ul style="margin-top: 10px;">
            ${report.analysis.keyTakeaways.map((point) => `<li>${point}</li>`).join('')}
          </ul>
        </div>

        <!-- Strengths & Areas for Improvement -->
        <div style="padding: 20px; background: #f9f9f9; border-radius: 5px; margin-bottom: 20px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <h3 style="color: #2c5282;">Strengths</h3>
              <ul style="margin-top: 10px;">
                ${report.analysis.strengths.map((strength) => `<li>${strength}</li>`).join('')}
              </ul>
            </div>
            <div>
              <h3 style="color: #2c5282;">Areas for Improvement</h3>
              <ul style="margin-top: 10px;">
                ${report.analysis.weaknesses.map((weakness) => `<li>${weakness}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <!-- Summary & Recommendations -->
        <div style="padding: 20px; background: #f9f9f9; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="color: #2c5282; margin-bottom: 15px;">Summary & Recommendations</h2>
          <p><strong>Summary:</strong> ${report.analysis.summary}</p>
          <p style="margin-top: 15px;"><strong>Verdict:</strong> ${report.recommendations.overallVerdict}</p>
          <p style="margin-top: 15px;"><strong>Next Steps:</strong> ${report.recommendations.nextSteps}</p>
          ${
            report.recommendations.suggestedFollowUpQuestions
              ? `
            <h3 style="color: #2c5282; margin-top: 15px;">Suggested Follow-up Questions</h3>
            <ul style="margin-top: 10px;">
              ${report.recommendations.suggestedFollowUpQuestions.map((question) => `<li>${question}</li>`).join('')}
            </ul>
          `
              : ''
          }
        </div>

        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          Generated by Grafito
        </div>
      </div>
    `,
    });

    return true;
  }

  private async generatePdf(htmlString: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlString);
    const pdfBuffer = await page.pdf();
    await browser.close();
    return pdfBuffer;
  }
}
