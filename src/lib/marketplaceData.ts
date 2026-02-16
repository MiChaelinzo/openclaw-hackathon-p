import type { Skill } from '@/lib/types'

export const marketplaceSkills: Skill[] = [
  {
    id: 'mp-001',
    name: 'GitHub Issue Tracker',
    description: 'Automatically monitor GitHub repositories for new issues, label them based on content, and send notifications. Includes sentiment analysis and priority detection.',
    code: `import { Octokit } from 'octokit'

async function trackIssues(repo: string, owner: string) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
  
  const { data: issues } = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    state: 'open',
    sort: 'created',
    direction: 'desc',
  })
  
  return issues.map(issue => ({
    number: issue.number,
    title: issue.title,
    body: issue.body,
    labels: issue.labels,
    created_at: issue.created_at,
  }))
}

export default trackIssues`,
    category: 'Monitoring',
    tags: ['github', 'automation', 'issues', 'tracking', 'notifications'],
    author: 'OpenClaw Team',
    version: '1.2.0',
    downloads: 15243,
    rating: 4.8,
    reviews: 342,
    price: 0,
    isVerified: true,
    isPremium: false,
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    dependencies: ['octokit@^5.0.0'],
    documentation: `# GitHub Issue Tracker

Monitor GitHub repositories for new issues and automatically process them.

## Setup

1. Set GITHUB_TOKEN environment variable
2. Configure repository owner and name
3. Run the skill with desired polling interval

## Features

- Real-time issue monitoring
- Automatic labeling based on content
- Priority detection
- Sentiment analysis
- Slack/Discord notifications

## Usage

\`\`\`typescript
const issues = await trackIssues('my-repo', 'my-org')
console.log(\`Found \${issues.length} open issues\`)
\`\`\``
  },
  {
    id: 'mp-002',
    name: 'Smart Email Responder',
    description: 'AI-powered email response system that understands context, generates appropriate replies, and handles common inquiries automatically with natural language.',
    code: `async function generateEmailResponse(email: string, context: string) {
  const prompt = spark.llmPrompt\`Analyze this email and generate a professional response:
  
Email: \${email}
Context: \${context}

Generate a helpful, professional response.\`
  
  const response = await spark.llm(prompt, 'gpt-4o')
  return response
}

export default generateEmailResponse`,
    category: 'Automation',
    tags: ['email', 'ai', 'automation', 'nlp', 'customer-service'],
    author: 'AI Labs',
    version: '2.0.1',
    downloads: 8721,
    rating: 4.6,
    reviews: 198,
    price: 9.99,
    isVerified: true,
    isPremium: true,
    createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    dependencies: [],
    documentation: `# Smart Email Responder

Automatically generate contextual email responses using AI.

## Features

- Context-aware responses
- Multiple tone options (professional, friendly, formal)
- Multi-language support
- Template customization
- Learning from feedback

## Configuration

Set response parameters in config:
- tone: professional | friendly | formal
- length: short | medium | long
- language: en | es | fr | de`
  },
  {
    id: 'mp-003',
    name: 'Code Review Assistant',
    description: 'Automated code review tool that analyzes pull requests, identifies potential bugs, suggests improvements, and ensures code quality standards.',
    code: `async function reviewCode(prUrl: string) {
  const analysis = await spark.llm(
    spark.llmPrompt\`Review this code for:
    - Bugs and security issues
    - Performance concerns
    - Best practices
    - Code style
    
    Provide actionable feedback.\`,
    'gpt-4o'
  )
  
  return JSON.parse(analysis)
}

export default reviewCode`,
    category: 'Development',
    tags: ['code-review', 'ai', 'github', 'quality', 'security'],
    author: 'DevTools Inc',
    version: '1.5.3',
    downloads: 12456,
    rating: 4.9,
    reviews: 287,
    price: 0,
    isVerified: true,
    isPremium: false,
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    dependencies: ['octokit@^5.0.0'],
    documentation: `# Code Review Assistant

AI-powered code review for pull requests.

## What it checks

- Security vulnerabilities
- Performance issues
- Code style violations
- Best practice deviations
- Potential bugs

## Integration

Works with GitHub, GitLab, and Bitbucket.`
  },
  {
    id: 'mp-004',
    name: 'Slack Notification Hub',
    description: 'Centralized notification system for Slack. Send formatted messages, create threads, and manage channels programmatically.',
    code: `async function sendSlackNotification(message: string, channel: string) {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${process.env.SLACK_TOKEN}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ channel, text: message }),
  })
  
  return response.json()
}

export default sendSlackNotification`,
    category: 'Integration',
    tags: ['slack', 'notifications', 'messaging', 'alerts'],
    author: 'Integrations Team',
    version: '1.0.0',
    downloads: 6234,
    rating: 4.5,
    reviews: 142,
    price: 0,
    isVerified: false,
    isPremium: false,
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    documentation: `# Slack Notification Hub

Send notifications to Slack channels.

## Setup

Set SLACK_TOKEN environment variable with your bot token.

## Features

- Send messages to channels
- Create threaded conversations
- Format messages with blocks
- Upload files
- Manage reactions`
  },
  {
    id: 'mp-005',
    name: 'Data Pipeline Manager',
    description: 'Build and orchestrate complex data pipelines with error handling, retry logic, and monitoring. Process data from multiple sources efficiently.',
    code: `class DataPipeline {
  async process(source: string, transformers: Function[]) {
    let data = await this.extract(source)
    
    for (const transform of transformers) {
      data = await transform(data)
    }
    
    return data
  }
  
  async extract(source: string) {
    // Extraction logic
    return []
  }
}

export default DataPipeline`,
    category: 'Data',
    tags: ['etl', 'data-processing', 'pipeline', 'automation'],
    author: 'DataOps Team',
    version: '2.1.0',
    downloads: 4521,
    rating: 4.7,
    reviews: 98,
    price: 14.99,
    isVerified: true,
    isPremium: true,
    createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    dependencies: [],
    documentation: `# Data Pipeline Manager

Build robust data processing pipelines.

## Architecture

- Extract: Pull data from sources
- Transform: Apply transformations
- Load: Save to destinations

## Features

- Error handling and retry logic
- Parallel processing
- Progress monitoring
- Data validation`
  },
  {
    id: 'mp-006',
    name: 'API Rate Limiter',
    description: 'Intelligent rate limiting for API calls with automatic retry, backoff strategies, and quota management across multiple services.',
    code: `class RateLimiter {
  private queue: Array<Function> = []
  private running = 0
  
  constructor(private maxConcurrent: number, private delayMs: number) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    while (this.running >= this.maxConcurrent) {
      await new Promise(resolve => setTimeout(resolve, this.delayMs))
    }
    
    this.running++
    try {
      return await fn()
    } finally {
      this.running--
    }
  }
}

export default RateLimiter`,
    category: 'Utilities',
    tags: ['rate-limiting', 'api', 'performance', 'reliability'],
    author: 'Performance Labs',
    version: '1.3.0',
    downloads: 9876,
    rating: 4.8,
    reviews: 234,
    price: 0,
    isVerified: true,
    isPremium: false,
    createdAt: Date.now() - 75 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    documentation: `# API Rate Limiter

Manage API call rates and prevent throttling.

## Usage

\`\`\`typescript
const limiter = new RateLimiter(10, 1000)
const result = await limiter.execute(() => fetch(url))
\`\`\`

## Strategies

- Token bucket
- Sliding window
- Fixed window
- Adaptive backoff`
  },
  {
    id: 'mp-007',
    name: 'Discord Bot Framework',
    description: 'Full-featured Discord bot framework with command handling, event listeners, and integration capabilities. Build powerful Discord bots quickly.',
    code: `class DiscordBot {
  private commands = new Map()
  
  command(name: string, handler: Function) {
    this.commands.set(name, handler)
  }
  
  async onMessage(message: any) {
    const [cmd, ...args] = message.content.split(' ')
    const handler = this.commands.get(cmd)
    
    if (handler) {
      await handler(message, args)
    }
  }
}

export default DiscordBot`,
    category: 'Integration',
    tags: ['discord', 'bot', 'chat', 'automation', 'community'],
    author: 'Bot Builders',
    version: '1.8.2',
    downloads: 11234,
    rating: 4.6,
    reviews: 267,
    price: 0,
    isVerified: false,
    isPremium: false,
    createdAt: Date.now() - 100 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    documentation: `# Discord Bot Framework

Create Discord bots with ease.

## Features

- Command handling
- Event system
- Slash commands
- Permissions
- Embeds and reactions

## Quick Start

\`\`\`typescript
const bot = new DiscordBot()
bot.command('!hello', (msg) => msg.reply('Hi!'))
\`\`\``
  },
  {
    id: 'mp-008',
    name: 'File Watcher & Processor',
    description: 'Monitor file system changes and automatically process files based on patterns. Supports various file types and custom processing pipelines.',
    code: `class FileWatcher {
  watch(path: string, callback: Function) {
    // Watch implementation
  }
  
  async processFile(path: string, processor: Function) {
    const content = await readFile(path)
    const result = await processor(content)
    return result
  }
}

export default FileWatcher`,
    category: 'Utilities',
    tags: ['file-system', 'automation', 'monitoring', 'processing'],
    author: 'System Tools',
    version: '1.1.0',
    downloads: 3421,
    rating: 4.4,
    reviews: 87,
    price: 0,
    isVerified: false,
    isPremium: false,
    createdAt: Date.now() - 55 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    documentation: `# File Watcher & Processor

Automate file processing workflows.

## Watch Patterns

- Glob patterns
- Regex matching
- Extension filtering
- Size limits

## Processors

- Image optimization
- Document conversion
- Data extraction
- Backup creation`
  },
  {
    id: 'mp-009',
    name: 'Web Scraper Pro',
    description: 'Advanced web scraping with JavaScript rendering, proxy support, and anti-detection measures. Extract structured data from any website reliably.',
    code: `async function scrapeWebsite(url: string, selectors: any) {
  const response = await fetch(url)
  const html = await response.text()
  
  // Parse and extract data
  const data = extractData(html, selectors)
  
  return data
}

function extractData(html: string, selectors: any) {
  // Extraction logic
  return {}
}

export default scrapeWebsite`,
    category: 'Data',
    tags: ['web-scraping', 'data-extraction', 'automation', 'crawling'],
    author: 'Web Automation Inc',
    version: '3.0.0',
    downloads: 7654,
    rating: 4.7,
    reviews: 178,
    price: 19.99,
    isVerified: true,
    isPremium: true,
    createdAt: Date.now() - 200 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    dependencies: [],
    documentation: `# Web Scraper Pro

Professional web scraping solution.

## Features

- JavaScript rendering
- Proxy rotation
- CAPTCHA solving
- Rate limiting
- Session management

## Anti-Detection

- User agent rotation
- Cookie handling
- Browser fingerprinting
- Request timing`
  },
  {
    id: 'mp-010',
    name: 'Cron Job Scheduler',
    description: 'Flexible task scheduling system with cron syntax support, job queues, and execution history. Schedule and manage recurring tasks effortlessly.',
    code: `class CronScheduler {
  private jobs = new Map()
  
  schedule(pattern: string, task: Function) {
    // Schedule implementation
    this.jobs.set(pattern, task)
  }
  
  async run() {
    for (const [pattern, task] of this.jobs) {
      if (this.shouldRun(pattern)) {
        await task()
      }
    }
  }
  
  shouldRun(pattern: string): boolean {
    // Cron pattern matching
    return true
  }
}

export default CronScheduler`,
    category: 'Automation',
    tags: ['scheduling', 'cron', 'tasks', 'automation', 'jobs'],
    author: 'Scheduler Pro',
    version: '2.2.0',
    downloads: 5432,
    rating: 4.5,
    reviews: 123,
    price: 0,
    isVerified: true,
    isPremium: false,
    createdAt: Date.now() - 150 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    documentation: `# Cron Job Scheduler

Schedule recurring tasks with ease.

## Cron Syntax

\`\`\`
* * * * * *
│ │ │ │ │ │
│ │ │ │ │ └─ day of week (0-6)
│ │ │ │ └─── month (1-12)
│ │ │ └───── day (1-31)
│ │ └─────── hour (0-23)
│ └───────── minute (0-59)
└─────────── second (0-59)
\`\`\`

## Examples

- \`0 0 * * *\` - Daily at midnight
- \`*/5 * * * *\` - Every 5 minutes`
  },
  {
    id: 'mp-011',
    name: 'Database Backup Agent',
    description: 'Automated database backup solution supporting PostgreSQL, MySQL, MongoDB, and more. Includes compression, encryption, and cloud storage.',
    code: `async function backupDatabase(config: any) {
  const connection = await connect(config)
  const data = await exportData(connection)
  const compressed = await compress(data)
  const encrypted = await encrypt(compressed)
  
  await uploadToCloud(encrypted, config.storage)
  
  return { success: true, size: encrypted.length }
}

export default backupDatabase`,
    category: 'Data',
    tags: ['backup', 'database', 'storage', 'security', 'automation'],
    author: 'Database Team',
    version: '1.4.0',
    downloads: 4231,
    rating: 4.8,
    reviews: 95,
    price: 12.99,
    isVerified: true,
    isPremium: true,
    createdAt: Date.now() - 95 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 9 * 24 * 60 * 60 * 1000,
    documentation: `# Database Backup Agent

Automated database backup solution.

## Supported Databases

- PostgreSQL
- MySQL / MariaDB
- MongoDB
- Redis
- SQLite

## Storage Options

- AWS S3
- Google Cloud Storage
- Azure Blob Storage
- Local filesystem`
  },
  {
    id: 'mp-012',
    name: 'CI/CD Pipeline Trigger',
    description: 'Trigger and monitor CI/CD pipelines across platforms like GitHub Actions, GitLab CI, CircleCI, and Jenkins. Unified interface for all platforms.',
    code: `async function triggerPipeline(platform: string, config: any) {
  const api = getPlatformAPI(platform)
  
  const response = await api.trigger({
    repo: config.repo,
    branch: config.branch,
    workflow: config.workflow
  })
  
  return monitorPipeline(response.id)
}

export default triggerPipeline`,
    category: 'Development',
    tags: ['ci-cd', 'devops', 'automation', 'deployment', 'testing'],
    author: 'DevOps Team',
    version: '1.0.5',
    downloads: 2876,
    rating: 4.6,
    reviews: 67,
    price: 0,
    isVerified: false,
    isPremium: false,
    createdAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    documentation: `# CI/CD Pipeline Trigger

Trigger and monitor CI/CD pipelines.

## Platforms

- GitHub Actions
- GitLab CI
- CircleCI
- Jenkins
- Travis CI

## Features

- Unified API
- Status monitoring
- Artifact download
- Log streaming`
  }
]
