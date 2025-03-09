import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { User } from '@prisma/client';

import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import OpenAI from 'openai';
import { FileInterceptor } from '@nestjs/platform-express';
import { AudioParsingService } from './audio-parsing/audio-parsing.service';
import { EmailService } from './email/email.service';
import { reportSchema } from './zod.schemas';

// this is the curated transcript
const prompt = `Reclutador: ¡Hola, Carlos! ¿Cómo andas?
  Candidato: ¡Hola! Bien, gracias. ¿Y tú?
  Reclutador: Bien, bien. Cuéntame, ¿qué has hecho últimamente en desarrollo?
  Candidato: He trabajado en varios proyectos de backend usando Node.js y he implementado microservicios con Docker.
  Reclutador: Suena interesante. ¿Cuál consideras que es tu mayor fortaleza técnica?
  Candidato: Diría que mi capacidad para resolver problemas complejos y optimizar código.
  Reclutador: Perfecto. ¿Qué te motiva a aplicar a esta posición?
  Candidato: Me entusiasma la idea de trabajar en proyectos innovadores y seguir aprendiendo nuevas tecnologías.
  Reclutador: Genial, gracias por compartir. ¡Hablamos pronto!`;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly audioParsingService: AudioParsingService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  getTest(): Promise<User[]> {
    return this.appService.getTest();
  }

  @Post('report')
  async report(
    transcript: string,
  ): Promise<z.infer<typeof reportSchema> | null> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a recruiter and you are given a transcript of a job interview. You need to analyze the transcript and provide a report with the following information: ',
          },
          { role: 'user', content: transcript },
        ],
        response_format: zodResponseFormat(reportSchema, 'report'),
      });

      const report = response.choices[0].message.content;
      const parsedReport = reportSchema.parse(report);
      return parsedReport;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Post('generate-report')
  @UseInterceptors(FileInterceptor('file'))
  async generateReport(@UploadedFile() file: Express.Multer.File) {
    const transcript = await this.audioParsingService.generateTranscript(file);

    const report = await this.report(transcript);

    if (!report) {
      return { error: 'Failed to generate report' };
    }

    const email = await this.emailService.sendEmail(
      'lucasbrumatti99@gmail.com',
      'Interview Report',
      'Interview Report',
      report,
    );

    return email;
  }
}
