import { Injectable } from "@nestjs/common";
import { OpenAI, toFile } from "openai";

@Injectable()
export class AudioParsingService {
  async generateTranscript(
    audioFile: Express.Multer.File,
  ): Promise<string> {
    if (!process.env.OPENAI_API_KEY)
      throw new Error("OPENAI_API_KEY is undefined");

    const openai_key = process.env.OPENAI_API_KEY;

    const openai = new OpenAI({
      apiKey: openai_key,
    });

    const transcription = await openai.audio.transcriptions.create({
      file: await toFile(audioFile.buffer, "audio.wav"),
      model: "whisper-1",
      language: "es",
    });

    return transcription.text;
  }
}
