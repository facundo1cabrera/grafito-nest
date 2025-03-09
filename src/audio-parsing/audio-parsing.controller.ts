import { Controller, Get, Post } from '@nestjs/common';
import { AudioParsingService } from './audio-parsing.service';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('audio')
export class AudioParsingController {
  constructor(private readonly AudioParsingService: AudioParsingService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async generateTranscript(@UploadedFile() file: Express.Multer.File) {

    return this.AudioParsingService.generateTranscript(file);

  }
}