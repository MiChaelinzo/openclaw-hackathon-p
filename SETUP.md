# Setup Guide

This guide will walk you through setting up AgentDev Studio from scratch.

## Prerequisites

Before you begin, ensure you have:

1. **Node.js 18+** installed on your system
2. **OpenClaw runtime** installed and configured
3. **Git** for version control
4. A **code editor** (VS Code recommended)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/agentdev-studio.git
cd agentdev-studio
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React and React DOM
- Shadcn UI components
- Tailwind CSS
- TypeScript
- Vite
- And all other dependencies

### 3. Configure Environment (Optional)

If you need custom configuration, create a `.env` file:

```bash
# .env
VITE_OPENCLAW_API_URL=http://localhost:3000
```

### 4. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## OpenClaw Integration

### Connecting to OpenClaw

AgentDev Studio uses the Spark runtime's built-in OpenClaw integration:

1. Skills follow OpenClaw patterns and conventions
2. The KV store persists data locally
3. LLM calls route through Spark's AI integration

### Supported OpenClaw Features

- ✅ Skill creation and management
- ✅ Tool call visualization
- ✅ Execution monitoring
- ✅ Local data persistence
- ✅ AI-powered assistance

## Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
npm run dev -- --port 3001
```

### TypeScript Errors

Clear the TypeScript cache:

```bash
rm -rf node_modules/.vite
npm run dev
```

### Missing Dependencies

Reinstall all packages:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

Once installed:

1. Open the Skill Library to see example skills
2. Check the Execution Monitor to view sample executions
3. Try the AI Assistant with the example prompts
4. Generate your first skill using the Skill Generator

## Need Help?

- Check the [main README](../README.md) for overview
- Review the [Usage Guide](./USAGE.md) for feature details
- Open an [issue](https://github.com/yourusername/agentdev-studio/issues) if you encounter problems
