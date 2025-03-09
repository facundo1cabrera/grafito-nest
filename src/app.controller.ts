import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from '@prisma/client';
import { EmailService } from './email/email.service';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import OpenAI from 'openai';
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
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  getTest(): Promise<User[]> {
    return this.appService.getTest();
  }

  @Post('report')
  async report(@Body() body: any) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a recruiter and you are given a transcript of a job interview. You need to analyze the transcript and provide a report with the following information: ',
          },
          { role: 'user', content: prompt },
        ],
        response_format: zodResponseFormat(reportSchema, 'report'),
      });

      return response.choices[0].message.content;
    } catch (error) {
      return error.message;
    }
  }
}
