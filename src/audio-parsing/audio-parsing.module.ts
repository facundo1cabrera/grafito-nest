import { Module } from '@nestjs/common';
import { AudioParsingController } from './audio-parsing.controller';
import { AudioParsingService } from './audio-parsing.service';
@Module({
    imports: [],
    controllers: [AudioParsingController],
    providers: [AudioParsingService],
  })
export class AudioParsingModule {

}
