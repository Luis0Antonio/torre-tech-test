/**
 * Fetches job opportunities from Torre.ai API based on a user's genome
 * @param username - The Torre.ai username (publicId)
 * @returns Promise with job opportunities matching the user's profile
 */
export async function getJobsForGenome(username: string) {
  try {
    const requestBody = {
      and: [
        {
          bestfor: {
            username: username,
            context: {
              contextFeature: "job_feed",
            },
          },
        },
        {
          status: {
            code: "open",
          },
        },
      ],
    };

    const response = await fetch(
      "https://search.torre.co/opportunities/_search?size=10",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorMessage = `Failed to fetch jobs: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred while fetching jobs");
  }
}

