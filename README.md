# 🎧 SupportFlow

**SupportFlow** is a modern, AI-powered customer support and ticketing platform designed to streamline helpdesk workflows, automate ticket triage with Google Gemini & OpenRouter AI, and provide real-time analytics for support teams.

---

## ✨ Features

- 🎟️ **Ticket Management**: Full lifecycle management of customer support tickets, filtering by priority, status, and tags.
- 🤖 **AI Support Copilot**: Instant ticket summaries, suggested responses, and sentiment analysis powered by AI.
- 📊 **Analytics & Reporting**: Visual insights into response times, resolution rates, ticket volume trends, and agent performance.
- 📚 **Knowledge Base**: Centralized documentation hub for public and internal help articles.
- ⚙️ **Automation Rules**: Custom rules engine for auto-assigning and tagging tickets based on triggers and conditions.
- 🌐 **Public Portal**: Simple, responsive public ticket submission form for customers.
- 🎨 **Modern UI/UX**: Built with Tailwind CSS v4, Motion animations, and dark mode support.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Motion](https://motion.dev/)
- **Icons & Charts**: [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/)
- **AI Integrations**: [`@google/genai`](https://www.npmjs.com/package/@google/genai), OpenRouter API
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js 18+ or Bun installed on your machine:
- Node.js (v18.0.0 or higher)
- npm, pnpm, yarn, or bun

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/supportflow.git
cd supportflow
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory and configure your environment variables:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
AI_KEY=your_ai_key
APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Running Development Server

Start the development server:

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📜 Available Scripts

- `npm run dev` — Starts the development server.
- `npm run build` — Builds the application for production deployment.
- `npm run start` — Runs the compiled production build locally.
- `npm run lint` — Runs TypeScript type-checking (`tsc --noEmit`).

---

## 📁 Project Structure

```text
supportflow/
├── src/
│   ├── app/           # Next.js App Router pages and API routes
│   ├── components/    # Reusable UI components (analytics, tickets, auth, etc.)
│   ├── config/        # Environment and app configuration
│   ├── context/       # React Context providers (Auth, Tickets, Settings)
│   ├── data/          # Mock data and static content
│   ├── lib/           # Utility functions and API helpers
│   ├── services/      # External service clients (AI, APIs)
│   └── types/         # TypeScript interfaces and types
├── public/            # Static assets
└── package.json       # Dependencies and scripts
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
