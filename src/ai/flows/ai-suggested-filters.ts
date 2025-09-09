'use server';
/**
 * @fileOverview An AI agent that suggests cryptocurrency filters.
 *
 * - getAiSuggestions - A function that suggests filters based on crypto data.
 * - AiSuggestionsInput - The input type for the getAiSuggestions function.
 * - AiSuggestionsOutput - The return type for the getAiSuggestions function.
 */

import { ai } from '@/ai/genkit';
import { CryptoCurrency } from '@/lib/types';
import { z } from 'zod';

const AiSuggestionsInputSchema = z.object({
  availableFilters: z.array(z.string()).describe('The list of available filters.'),
  activeFilters: z.array(z.string()).describe('The list of currently active filters.'),
  cryptoData: z
    .array(
      z.object({
        name: z.string(),
        symbol: z.string(),
        price: z.number(),
        percentChange24h: z.number(),
        marketCap: z.number(),
        volume24h: z.number(),
      })
    )
    .describe('The list of cryptocurrency data.'),
});
export type AiSuggestionsInput = z.infer<typeof AiSuggestionsInputSchema>;

const AiSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(
      z.object({
        filter: z.string().describe('The suggested filter name. Must be one of the available filters.'),
        reason: z.string().describe('A short, compelling reason why this filter is suggested (e.g., "Market is volatile today").'),
      })
    )
    .describe('A list of suggested filters.'),
});
export type AiSuggestionsOutput = z.infer<typeof AiSuggestionsOutputSchema>;

export async function getAiSuggestions(input: AiSuggestionsInput): Promise<AiSuggestionsOutput> {
  return aiSuggestedFiltersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSuggestedFiltersPrompt',
  input: { schema: AiSuggestionsInputSchema },
  output: { schema: AiSuggestionsOutputSchema },
  prompt: `You are a crypto market analyst AI. Your goal is to suggest helpful filters to the user based on the current market data.

Analyze the provided cryptocurrency data and suggest up to 2 relevant filters from the list of available filters.
Do not suggest filters that are already active.
Provide a concise reason for each suggestion.

Available filters: {{{json availableFilters}}}
Already active filters: {{{json activeFilters}}}

Current market data:
{{{json cryptoData}}}
`,
});

const aiSuggestedFiltersFlow = ai.defineFlow(
  {
    name: 'aiSuggestedFiltersFlow',
    inputSchema: AiSuggestionsInputSchema,
    outputSchema: AiSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
