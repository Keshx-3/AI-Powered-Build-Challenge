
'use server';

import { getAiSuggestions as getAiSuggestionsFlow, type AiSuggestionsInput } from '@/ai/flows/ai-suggested-filters';
import { fetchCryptoData } from '@/lib/data';

export async function fetchDataAction() {
  try {
    const data = await fetchCryptoData();
    // If data is empty, it could be a rate limit issue, don't treat as a hard error.
    if (data.length === 0) {
        return { data: [] };
    }
    return { data };
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    // Ensure error is a string before checking includes
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { error: `Failed to fetch data due to a server error. ${errorMessage}` };
  }
}


export async function getAiSuggestions(input: AiSuggestionsInput) {
  try {
    const suggestions = await getAiSuggestionsFlow(input);
    return { suggestions };
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    return { error: 'Failed to get AI suggestions due to a server error.' };
  }
}
