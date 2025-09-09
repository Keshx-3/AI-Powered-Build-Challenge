# AI-Powered Build Challenge

This is a Next.js application built in Firebase Studio that displays real-time cryptocurrency market data. It features AI-powered filter suggestions to help users analyze the market based on current trends.

## Features

- **Real-time Data**: View data for the top 100 cryptocurrencies, automatically refreshing every 30 seconds.
- **Search**: Instantly find coins by searching for their name or symbol.
- **Dynamic Filters**: Filter the list by pre-defined categories like "Top Gainer," "Top Loser," "High Market Cap," and "High Volume."
- **AI-Powered Suggestions**: Receive intelligent filter suggestions from an AI agent that analyzes the current market conditions.
- **Detailed Coin View**: Click on any cryptocurrency to see a detailed view, including a 7-day price chart and key financial metrics.
- **Pagination**: Navigate the extensive list of coins with a clean and intuitive pagination component.
- **Responsive Design**: The application is fully responsive and works seamlessly on both desktop and mobile devices.
- **Theming**: Switch between dark and light modes.
- **Informational Tooltips**: Hover over key metrics like "Market Cap" to get clear, user-friendly definitions.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI/Generative**: [Firebase Genkit](https://firebase.google.com/docs/genkit) with the [Google AI Plugin](https://www.npmjs.com/package/@genkit-ai/googleai)
- **Data Source**: [CoinMarketCap API](https://coinmarketcap.com/api/)

## AI Functionality: Suggested Filters

The core AI feature of this application is the "AI Suggestions" bar, which provides users with contextual filter recommendations.

### Implementation

This feature is powered by a Genkit flow defined in `src/ai/flows/ai-suggested-filters.ts`. The flow takes the current list of available filters, active filters, and a snapshot of the market data as input. It then uses a large language model to analyze this information and return up to two relevant filter suggestions with a brief justification for each.

### Prompt

The following prompt is used to instruct the AI model. It is designed to make the model act as a crypto market analyst and provide helpful, non-redundant suggestions based on the data it receives.

```prompt
You are a crypto market analyst AI. Your goal is to suggest helpful filters to the user based on the current market data.

Analyze the provided cryptocurrency data and suggest up to 2 relevant filters from the list of available filters.
Do not suggest filters that are already active.
Provide a concise reason for each suggestion.

Available filters: {{{json availableFilters}}}
Already active filters: {{{json activeFilters}}}

Current market data:
{{{json cryptoData}}}
```

This structured approach ensures the AI's output is consistent, relevant, and can be easily parsed and displayed in the user interface.

## Getting Started

To run this project locally, you will need to set up a `.env.local` file with your CoinMarketCap API key.

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   Create a file named `.env` in the root of the project and add your API key:
   ```
   COINMARKETCAP_API_KEY=your_api_key_here
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:9002`.
