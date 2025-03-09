import { z } from "zod";

export const reportSchema = z.object({
    interview: z.object({
      id: z.string(),
      candidateName: z.string(),
      position: z.string(),
      date: z.string(),
      duration: z.number().optional(),
      zoomRecordingUrl: z.string().optional(),
    }),
    analysis: z.object({
      transcript: z.string(),
      summary: z.string(),
      technicalScore: z.number(),
      communicationScore: z.number(),
      problemSolvingScore: z.number(),
      keyTakeaways: z.array(z.string()),
      technicalConcepts: z.array(z.string()),
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
      redFlags: z.array(z.string()).optional(),
    }),
    recommendations: z.object({
      overallVerdict: z.string(),
      nextSteps: z.string(),
      suggestedFollowUpQuestions: z.array(z.string()).optional(),
    }),
  }