import { generateText } from "ai";
import { google } from "@ai-sdk/google";

/**
 * Generates a summary using AI based on genome and job data
 * @param genomeData - The user's genome/profile data
 * @param jobData - The selected job data
 * @returns Promise with the generated summary text
 */
export async function generateSummary(
  genomeData: unknown,
  jobData: unknown
): Promise<string> {
  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `
      You are an expert recruiter who will help the user to generate a presentation letter for a job application.

      Generate a presentation letter based on the following information:

Genome/Profile Data:
${JSON.stringify(genomeData, null, 2)}

Job Data:
${JSON.stringify(jobData, null, 2)}

Please provide a concise summary that highlights the key alignment between the profile and the job opportunity.

Make sure to use my strengths and skills to make the letter more appealing to the recruiter. Make a match between my data to the job requirements.

This won't be sent via email, it will be sent via the job application platform.

This should be plain text, no markdown.
Don't use bold, italic, underline, or any other formatting.
`,
    });

    return text;
  } catch (error) {
    console.error("Error generating summary:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
    throw new Error("Unknown error occurred while generating summary");
  }
}

