# Asymmetri AI Assistant

A modern, full-stack AI assistant built with Next.js, Vercel AI SDK, and Google Gemini.

## 🚀 Features

- **Conversational AI**: Powered by Google's `gemini-2.5-flash` for fast and intelligent responses.
- **Real-time Tools**:
  - **Weather**: Get current weather conditions for any city via OpenWeather.
  - **Stocks**: Retrieve live stock prices and market data via Alpha Vantage.
  - **F1 News**: Get information about the next Formula 1 race.
- **Modern UI**: A professional gray and blue theme with responsive layouts and dark mode support.
- **Authentication**: Secure login via GitHub and Google using NextAuth.js (Auth.js) v5.
- **Persistent Chat History**: Messages are stored in a PostgreSQL database (Neon) using Drizzle ORM.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **AI**: [Vercel AI SDK](https://sdk.vercel.ai/) & [Google Gemini](https://ai.google.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [PostgreSQL (Neon)](https://neon.tech/) & [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [Auth.js v5](https://authjs.dev/)

## ⚙️ Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
# Database
DATABASE_URL=your_neon_postgresql_url

# Auth
AUTH_SECRET=your_auth_secret
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# AI & Tools
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
```

### 2. Installation

```bash
npm install
```

### 3. Database Migration

```bash
npx drizzle-kit push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.