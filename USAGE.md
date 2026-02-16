# Usage Guide

Learn how to use each feature of AgentDev Studio effectively.

## Overview

AgentDev Studio has five main sections accessible via the top navigation tabs:

1. **Skill Library** - Manage your OpenClaw skills
2. **Marketplace** - Discover and install community skills
3. **Execution Monitor** - Track agent executions in real-time
4. **AI Assistant** - Get debugging help and guidance
5. **Skill Generator** - Create skills from natural language

---

## Skill Library

### Browsing Skills

Skills are organized by category:
- **Monitoring**: Skills that watch systems and send alerts
- **Automation**: Skills that automate repetitive tasks
- **Integration**: Skills that connect different services
- **Development**: Tools for developers
- **Data**: ETL and data processing
- **Utilities**: General purpose tools
- **Custom**: Your manually created skills
- **Generated**: AI-generated skills

### Creating a New Skill

1. Click "New Skill" button
2. Fill in the skill details:
   - **Name**: Short, descriptive name
   - **Category**: Choose appropriate category
   - **Description**: One-line explanation
   - **Code**: Complete TypeScript skill code
3. Click "Create Skill"

**Example Skill Structure:**

```typescript
import { ToolAPI } from 'openclaw-tools';

async function mySkill(param: string) {
  const api = new ToolAPI();
  
  // Your logic here
  const result = await api.doSomething(param);
  
  // Error handling
  if (!result) {
    throw new Error('Operation failed');
  }
  
  return result;
}

export default mySkill;
```

### Editing Skills

1. Click on any skill card in the library
2. Modify the skill details in the dialog
3. Click "Update Skill" to save changes

---

## Skill Marketplace

### Discovering Skills

The marketplace provides access to 12+ pre-built community skills across multiple categories:

**Browse Tab**: Full marketplace with advanced filtering
**Featured Tab**: High-quality, verified skills (4.5+ stars)
**Trending Tab**: Most popular skills by downloads

### Searching & Filtering

**Search Bar**
- Type to search across names, descriptions, and tags
- Results update in real-time as you type

**Category Filter**
- Filter by skill type (Monitoring, Automation, Data, etc.)
- Select "All Categories" to see everything

**Sort Options**
- **Most Popular**: Ordered by download count
- **Most Recent**: Newest skills first
- **Highest Rated**: Best ratings first
- **Name (A-Z)**: Alphabetical order

**Quick Filters**
- **Verified**: Show only OpenClaw team verified skills
- **Premium**: Show only professionally maintained skills
- **Price**: Filter by free, paid, or all skills

**Tag Filters**
- Click any tag to filter by that topic
- Multiple tags can be selected
- Click again to remove tag filter

**Clear Filters**
- Click "Clear all" to reset all filters at once

### Viewing Skill Details

Click any skill card to view:
- Complete description and use cases
- Full source code with syntax
- Documentation and examples
- Dependencies and requirements
- Author information
- Ratings, reviews, and downloads
- Version and update history
- Installation button

### Installing Skills

**From Browse/Trending View:**
1. Find the skill you want
2. Click "Install" button on the card
3. Skill is added to your library instantly

**From Detail View:**
1. Click skill card to open details
2. Review code and documentation
3. Click "Install Skill" button
4. Navigate back or go to library

**Important Notes:**
- Already installed skills show "Installed" (disabled button)
- Skills are installed with all metadata (author, rating, etc.)
- Installed skills appear immediately in your Skill Library

### Understanding Quality Indicators

**Verified Badge** (✓ with cyan check)
- Reviewed by OpenClaw team
- Security checked
- Well documented
- Actively maintained

**Premium Badge** (👑 crown icon)
- Professional quality
- Advanced features
- Priority support
- May have pricing (future)

**Star Ratings** (⭐)
- Community rating from 1-5 stars
- Number of reviews shown in parentheses
- Average of all user ratings

**Download Count** (↓ download icon)
- Total community installs
- Indicates popularity and trust
- Higher count = more battle-tested

### Marketplace Categories

**Monitoring**
- GitHub issue trackers
- System health monitors
- Alert systems

**Automation**
- Email responders
- Task schedulers
- Workflow automation

**Development**
- Code review assistants
- CI/CD triggers
- Testing tools

**Integration**
- Slack/Discord bots
- API connectors
- Webhook handlers

**Data**
- ETL pipelines
- Web scrapers
- Database backups

**Utilities**
- Rate limiters
- File watchers
- Helper functions

### Example Marketplace Skills

**GitHub Issue Tracker** (Free, Verified)
- Monitors repositories for new issues
- Automatic labeling
- Sentiment analysis
- 15K+ downloads, 4.8★ rating

**Smart Email Responder** ($9.99, Premium)
- AI-powered email automation
- Context-aware responses
- Multi-language support
- 8.7K downloads, 4.6★ rating

**Code Review Assistant** (Free, Verified)
- Automated PR analysis
- Security scanning
- Best practice checks
- 12.4K downloads, 4.9★ rating

---

## Execution Monitor

### Understanding Executions

Each execution shows:
- **Skill name** and execution ID
- **Status badge**: Running (pulsing), Success (green), Error (red)
- **Timestamps**: Start time and duration
- **Execution steps**: Chronological flow of the agent's actions

### Step Types

- **Reasoning**: Agent's thought process
- **Tool Call**: External API or tool invocations
- **Result**: Successful outputs
- **Error**: Failure states with details

### Reading Execution Logs

Steps are displayed chronologically with:
- Colored indicators (blue for reasoning, green for success, red for errors)
- Tool names for API calls
- Duration metrics for performance analysis
- Full content of each step

---

## AI Assistant

### Getting Help

The AI Assistant can help with:
- Debugging errors in your skills
- Explaining OpenClaw concepts
- Suggesting best practices
- Providing code examples
- Answering technical questions

### Example Questions

**Debugging:**
- "Why is my GitHub API call failing?"
- "How do I handle authentication errors?"
- "My agent isn't responding - what should I check?"

**Learning:**
- "What are OpenClaw skills?"
- "How do tool calls work?"
- "Explain the agent execution lifecycle"

**Best Practices:**
- "What's the best way to structure error handling?"
- "How should I organize complex multi-step skills?"
- "When should I use synchronous vs asynchronous operations?"

### Using the Chat

1. Type your question in the input field
2. Press Enter or click Send
3. Wait for AI response (indicated by pulsing dots)
4. Review the answer and ask follow-ups if needed

**Tip:** Provide context about your specific problem for more targeted help.

---

## Skill Generator

### Generating Skills from Descriptions

1. Navigate to the Skill Generator tab
2. Describe what you want your skill to do in natural language
3. Click "Generate Skill"
4. Review the generated code
5. Edit if needed
6. Click "Save to Library"

### Writing Good Descriptions

**Be specific about:**
- What the skill should do
- Which tools/APIs it should use
- When it should execute
- What inputs it needs
- What outputs it should produce

**Good Example:**
```
Create a skill that monitors my GitHub repositories for new pull 
requests. When it finds new PRs, check if they have been reviewed. 
If a PR has been open for more than 24 hours without review, send 
me a Slack notification. The skill should run every 2 hours.
```

**Poor Example:**
```
Make something that checks GitHub
```

### Example Prompts

Try these example prompts (click them in the UI):

1. **Stripe Balance Monitor**
   - Checks account balance hourly
   - Sends alerts if below threshold

2. **Slack Digest**
   - Summarizes channel messages
   - Creates daily digest

3. **PR Code Quality Checker**
   - Watches for new pull requests
   - Runs automated quality checks

### Editing Generated Skills

After generation:
- **Name**: Modify if the AI's suggestion isn't ideal
- **Description**: Refine for clarity
- **Code**: Add custom logic or adjust parameters

---

## Tips & Best Practices

### Skill Development

1. **Start simple**: Create basic skills before complex ones
2. **Use types**: TypeScript types catch errors early
3. **Handle errors**: Always include try-catch blocks
4. **Test incrementally**: Validate each part before combining

### Debugging

1. **Check execution steps**: Use the monitor to see where failures occur
2. **Read error messages**: They usually point to the exact problem
3. **Ask the AI**: The assistant can interpret cryptic errors
4. **Review logs**: Sequential steps reveal the execution flow

### Organization

1. **Use categories**: Keep skills organized by purpose
2. **Write descriptions**: Help your future self understand skills
3. **Version control**: Consider backing up your skill library
4. **Name consistently**: Use clear, descriptive names

---

## Keyboard Shortcuts

- **Tab Navigation**: Quickly switch between sections
- **Enter in Chat**: Send message to AI Assistant
- **Shift + Enter**: New line in textarea
- **Escape**: Close dialogs

---

## Common Workflows

### Creating a Monitoring Agent

1. Go to Skill Generator
2. Describe your monitoring needs
3. Generate and review the skill
4. Save to library under "Monitoring" category
5. Check Execution Monitor to verify it runs

### Debugging a Failing Skill

1. Open Execution Monitor
2. Find the failed execution
3. Read the error message and steps
4. Go to AI Assistant
5. Paste the error and ask for help
6. Apply the suggested fix
7. Test again

### Building a Complex Workflow

1. Break down into smaller skills
2. Create each skill separately
3. Test individually
4. Combine into orchestrated workflow
5. Monitor end-to-end execution

---

## Need More Help?

- Review the [Setup Guide](./SETUP.md) for installation issues
- Check the [README](../README.md) for project overview
- Open an [issue](https://github.com/yourusername/agentdev-studio/issues) for bugs
