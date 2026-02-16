# AgentDev Studio

**A comprehensive visual development environment for OpenClaw agents**

![Track: Developer Infrastructure & Tools](https://img.shields.io/badge/Track-Developer%20Infrastructure%20%26%20Tools-blue)
![Built with OpenClaw](https://img.shields.io/badge/Built%20with-OpenClaw-green)
![React](https://img.shields.io/badge/React-19.2-61dafb)

AgentDev Studio is a powerful developer tool that accelerates OpenClaw agent development through real-time monitoring, interactive testing, and AI-powered debugging assistance. It provides a professional IDE-like experience specifically designed for building autonomous agents.

---

## 🎯 Problem It Solves

Developing autonomous agents with OpenClaw requires juggling multiple concerns:
- **Debugging complexity**: Understanding multi-step agent execution flows with tool calls, reasoning, and error states
- **Skill creation overhead**: Writing boilerplate code and following OpenClaw patterns from scratch
- **Limited visibility**: No way to observe agent behavior in real-time or trace execution paths
- **Knowledge gaps**: Learning OpenClaw conventions and best practices through trial and error

**AgentDev Studio solves these problems** by providing:
1. **Real-time execution monitoring** - Watch agents think, call tools, and produce results step-by-step
2. **AI-assisted skill generation** - Generate production-ready skills from natural language descriptions
3. **Intelligent debugging** - Get contextual help analyzing errors and understanding agent behavior
4. **Centralized skill management** - Browse, edit, and organize skills in one place

---

## ✨ Key Features

### 🔧 Skill Library & Editor
- Browse skills organized by category (Monitoring, Automation, Integration, etc.)
- Create and edit skills with inline validation
- Real-time syntax checking
- Quick access to frequently used patterns

### 📊 Execution Monitor
- Real-time visualization of agent executions
- Step-by-step breakdown showing:
  - Reasoning processes
  - Tool calls with duration metrics
  - Results and outputs
  - Error states with context
- Historical execution log
- Status tracking (running, success, error)

### 🤖 AI Debug Assistant
- Context-aware help powered by GPT-4
- Analyzes errors and suggests specific fixes
- Explains OpenClaw concepts and patterns
- Provides best practices guidance
- Interactive chat interface with conversation history

### ✨ Skill Generator
- Generate complete skills from natural language descriptions
- AI understands OpenClaw patterns and conventions
- Produces production-ready code with:
  - Proper imports and type definitions
  - Error handling
  - Tool usage patterns
  - Helpful comments
- Preview and edit before saving
- Example prompts to get started quickly

---

## 🚀 How OpenClaw Enables This

AgentDev Studio leverages OpenClaw's core capabilities:

1. **Local-First Architecture**: All skill management and execution tracking happens locally, ensuring privacy and no cloud dependencies

2. **Tool Integration**: Demonstrates how OpenClaw agents interact with external systems (GitHub, Stripe, Slack APIs)

3. **Persistent Memory**: Uses OpenClaw's KV store to maintain skill library and execution history across sessions

4. **AI Model Access**: Integrates with OpenClaw's LLM capabilities to power:
   - Intelligent debugging assistance
   - Automated skill generation
   - Natural language understanding

5. **Self-Hosted Runtime**: Runs entirely within the user's environment, showcasing OpenClaw's self-contained execution model

---

## 🎨 Design Philosophy

AgentDev Studio follows a **developer-first design approach**:

- **Technical Confidence**: Dark theme with high contrast optimized for long development sessions
- **Information Density**: Efficient use of space without overwhelming the interface
- **Real-time Feedback**: Immediate visual responses to actions and state changes
- **Professional Aesthetics**: IDE-quality interface that feels familiar to developers

### Color System
- Primary: Deep electric blue for active states and primary actions
- Accent: Vibrant cyan for highlights and interactive elements
- Semantic colors: Green (success), Amber (warning), Coral (error), Sky blue (info)
- Dark slate backgrounds with carefully calibrated contrast ratios (WCAG AA compliant)

### Typography
- **Space Grotesk**: Modern geometric sans-serif for UI elements
- **JetBrains Mono**: Developer-focused monospace for code

---

## 📦 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- OpenClaw runtime installed and configured
- GitHub Spark environment (this app runs as a Spark)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/agentdev-studio.git
cd agentdev-studio
```

2. **Install dependencies**
```bash
npm install
```

3. **Run in development mode**
```bash
npm run dev
```

4. **Open in browser**
Navigate to `http://localhost:5173` (or the port shown in terminal)

### Using with OpenClaw

AgentDev Studio is designed to work alongside your OpenClaw installation:

1. Skills created in AgentDev Studio follow OpenClaw patterns
2. Use the AI Assistant to get help with OpenClaw-specific questions
3. Monitor executions to understand how your agents interact with tools
4. Generate new skills using natural language descriptions

---

## 🎥 Demo

### Screenshots

**Skill Library**
Browse and manage your OpenClaw skills organized by category with quick access to create new ones.

**Execution Monitor**
Real-time step-by-step visualization of agent executions showing reasoning, tool calls, and results.

**AI Assistant**
Get intelligent help debugging issues and understanding OpenClaw concepts.

**Skill Generator**
Generate production-ready skills from natural language descriptions with AI assistance.

### Video Demo
[Link to demo video - showing skill creation, execution monitoring, and AI assistance in action]

---

## 🛠️ Technology Stack

- **Framework**: React 19.2 with TypeScript
- **UI Components**: Shadcn v4 (40+ pre-configured components)
- **Styling**: Tailwind CSS v4 with custom theme
- **Icons**: Phosphor Icons
- **State Management**: React hooks + Spark KV store
- **AI Integration**: OpenAI GPT-4 via Spark runtime
- **Build Tool**: Vite 7

---

## 🏗️ Architecture

```
AgentDev Studio
├── Skill Library (Browse, Create, Edit)
│   └── Persistent storage via useKV
├── Execution Monitor (Real-time tracking)
│   └── Step-by-step visualization
├── AI Assistant (Contextual help)
│   └── GPT-4 powered analysis
└── Skill Generator (AI-powered creation)
    └── Natural language → Code
```

### Data Flow
1. **Skills** are stored in `agentdev-skills` KV key
2. **Executions** are tracked in `agentdev-executions` KV key
3. **AI interactions** use Spark's llm API with GPT-4
4. All data persists locally via OpenClaw's KV store

---

## 🤝 Contributing to the OpenClaw Ecosystem

AgentDev Studio is designed to be **reusable and extensible**:

### Reusable Components
- Execution visualizer can be extracted for other monitoring tools
- AI assistant pattern works for any agent framework
- Skill generator approach applicable to other agent systems

### Community Benefits
- **Lower barrier to entry**: Visual tools make OpenClaw more accessible
- **Faster development**: AI-assisted generation speeds up skill creation
- **Better debugging**: Real-time monitoring improves developer experience
- **Knowledge sharing**: Example skills demonstrate patterns and best practices

### Future Enhancements
- [ ] Skill marketplace integration
- [ ] Collaborative editing and sharing
- [ ] Advanced testing framework with assertions
- [ ] Performance profiling and optimization suggestions
- [ ] Integration with version control systems
- [ ] Multi-agent orchestration visualization
- [ ] Plugin system for custom tools and integrations

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

Built for the OpenClaw Hackathon, demonstrating how developer tools can accelerate agent development and make autonomous systems more accessible.

Special thanks to:
- OpenClaw team for creating an open, self-hosted agent runtime
- Shadcn for the excellent UI component library
- The autonomous agent community for inspiration and feedback

---

## 📞 Contact & Links

- **GitHub**: [yourusername/agentdev-studio](https://github.com/yourusername/agentdev-studio)
- **Live Demo**: [Link to deployed instance]
- **Documentation**: [Full docs](./docs)
- **Issues**: [Report bugs or request features](https://github.com/yourusername/agentdev-studio/issues)

---

**Built with ❤️ for the OpenClaw community**
