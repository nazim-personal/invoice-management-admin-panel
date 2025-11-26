'use server';

/**
 * @fileOverview Provides a summary of customer insights, including relevant news and social media updates.
 *
 * - getCustomerInsightsSummary - A function that retrieves and summarizes customer insights.
 * - CustomerInsightsSummaryInput - The input type for the getCustomerInsightsSummary function.
 * - CustomerInsightsSummaryOutput - The return type for the getCustomerInsightsSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomerInsightsSummaryInputSchema = z.object({
  customerName: z.string().describe('The name of the customer to get insights for.'),
});
export type CustomerInsightsSummaryInput = z.infer<typeof CustomerInsightsSummaryInputSchema>;

const CustomerInsightsSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of recent news and social media updates for the customer.'),
});
export type CustomerInsightsSummaryOutput = z.infer<typeof CustomerInsightsSummaryOutputSchema>;

export async function getCustomerInsightsSummary(input: CustomerInsightsSummaryInput): Promise<CustomerInsightsSummaryOutput> {
  return customerInsightsSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customerInsightsSummaryPrompt',
  input: {schema: CustomerInsightsSummaryInputSchema},
  output: {schema: CustomerInsightsSummaryOutputSchema},
  prompt: `You are a business intelligence assistant. Provide a summary of recent news and social media updates for the customer named {{{customerName}}}. Focus on information that could be relevant for personalizing interactions or understanding their business needs.`,
});

const customerInsightsSummaryFlow = ai.defineFlow(
  {
    name: 'customerInsightsSummaryFlow',
    inputSchema: CustomerInsightsSummaryInputSchema,
    outputSchema: CustomerInsightsSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
