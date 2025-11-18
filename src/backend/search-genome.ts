/**
 * Fetches user genome data from Torre.ai API
 * @param username - The Torre.ai username (publicId)
 * @returns Promise with the user's genome data
 */
export async function searchGenome(username: string) {
  try {
    const response = await fetch(
      `https://torre.ai/api/genome/bios/${username}`
    );

    if (!response.ok) {
      // Preserve the status code in the error message for the API route to handle
      const errorMessage = response.status === 404 
        ? "Not Found" 
        : `Failed to fetch genome data: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw the error to preserve status information
      throw error;
    }
    throw new Error("Unknown error occurred while fetching genome data");
  }
}

