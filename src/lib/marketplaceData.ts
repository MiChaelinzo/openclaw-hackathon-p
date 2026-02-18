import type { Skill } from '@/lib/types'

const now = Date.now()
const minutesAgo = (minutes: number) => now - minutes * 60 * 1000
const hoursAgo = (hours: number) => now - hours * 60 * 60 * 1000
const daysAgo = (days: number) => now - days * 24 * 60 * 60 * 1000
const weeksAgo = (weeks: number) => now - weeks * 7 * 24 * 60 * 60 * 1000

export const marketplaceSkills: Skill[] = [
  {
    id: 'mp-001',
    name: 'GitHub Issue Tracker',
    description: 'Automatically monitor GitHub repositories for new issues, label them based on content, and send notifications. Includes sentiment analysis and priority detection.',
    code: `import { Octokit } from 'octokit'

async function trackIssues(repo: string, owner: string) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
  const { data: issues } = await octokit.rest.issues.listForRepo({
    owner, repo, state: 'open', sort: 'created', direction: 'desc',
  })
  return issues.map(issue => ({
    number: issue.number, title: issue.title, body: issue.body,
    labels: issue.labels, created_at: issue.created_at,
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
    createdAt: daysAgo(45),
    updatedAt: hoursAgo(18),
    dependencies: ['octokit@^5.0.0'],
    documentation: `# GitHub Issue Tracker\n\nMonitor GitHub repositories for new issues.\n\n## Features\n- Real-time monitoring\n- Auto-labeling\n- Notifications`
  },
  {
    id: 'mp-002',
    name: 'Smart Email Responder',
    description: 'AI-powered email response system. Generates appropriate replies automatically with natural language understanding.',
    code: `async function generateEmailResponse(email: string, context: string) {
  const prompt = spark.llmPrompt\`Generate professional response for: \${email}\\nContext: \${context}\`
  return await spark.llm(prompt, 'gpt-4o')
}
export default generateEmailResponse`,
    category: 'Automation',
    tags: ['email', 'ai', 'automation', 'nlp', 'customer-service'],
    author: 'AI Labs',
    version: '2.0.1',
    downloads: 8721,
    rating: 4.6,
    reviews: 198,
    price: 4.99,
    isVerified: true,
    isPremium: true,
    createdAt: daysAgo(60),
    updatedAt: daysAgo(2),
    dependencies: [],
    paymentAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    x402Enabled: true,
    documentation: `# Smart Email Responder\n\nAI-powered email automation.\n\n## Features\n- Context-aware responses\n- Multiple tones\n- Multi-language`
  },
  {
    id: 'mp-003',
    name: 'Enterprise Security Auditor',
    description: 'Comprehensive security audit tool. Scans for vulnerabilities, checks dependencies, and generates compliance reports. OWASP Top 10 coverage.',
    code: `async function auditSecurity(repo: string) {
  const results = {
    vulnerabilities: await scanVulnerabilities(repo),
    dependencies: await checkDependencies(repo),
    compliance: await generateCompliance(repo)
  }
  return results
}
export default auditSecurity`,
    category: 'Security',
    tags: ['security', 'audit', 'compliance', 'vulnerabilities', 'enterprise'],
    author: 'SecureOps Pro',
    version: '3.2.1',
    downloads: 18432,
    rating: 4.9,
    reviews: 421,
    price: 49.99,
    isVerified: true,
    isPremium: true,
    createdAt: daysAgo(90),
    updatedAt: hoursAgo(24),
    dependencies: [],
    paymentAddress: '0x9876543210ABCDEFabcdef9876543210ABCDEF98',
    x402Enabled: true,
    documentation: `# Enterprise Security Auditor\n\nProfessional security auditing.\n\n## Features\n- OWASP Top 10 scanning\n- CVE database checks\n- SOC2/ISO compliance\n- Automated remediation`
  },
  {
    id: 'mp-004',
    name: 'AI Content Generator Suite',
    description: 'Advanced AI content generation for blogs, social media, marketing copy. Multiple models, tone control, SEO optimization included.',
    code: `async function generateContent(type: string, topic: string, options: any) {
  const prompt = spark.llmPrompt\`Generate \${type} about \${topic}. Style: \${options.tone || 'professional'}\`
  const content = await spark.llm(prompt, options.model || 'gpt-4o')
  return { content, metadata: extractMetadata(content) }
}
export default generateContent`,
    category: 'Content',
    tags: ['ai', 'content', 'writing', 'marketing', 'seo', 'copywriting'],
    author: 'ContentAI Labs',
    version: '2.5.0',
    downloads: 24567,
    rating: 4.8,
    reviews: 589,
    price: 24.99,
    isVerified: true,
    isPremium: true,
    createdAt: daysAgo(75),
    updatedAt: daysAgo(1),
    dependencies: [],
    paymentAddress: '0x3456789012ABCDEFabcdef3456789012ABCDEF34',
    x402Enabled: true,
    documentation: `# AI Content Generator\n\nProfessional content generation.\n\n## Types\n- Blog posts\n- Social media\n- Marketing copy\n- Documentation\n\n## Features\n- Multiple AI models\n- Tone control\n- SEO optimization\n- 20+ languages`
  },
  {
    id: 'mp-005',
    name: 'Smart Contract Deployer',
    description: 'Deploy and manage smart contracts across multiple blockchain networks. Testing, verification, monitoring included. Supports Ethereum, Polygon, BSC.',
    code: `async function deployContract(network: string, contract: any, config: any) {
  const compiled = await compileContract(contract)
  const deployment = await deploy({ contract: compiled, network, params: config.params })
  await verifyContract(deployment.address, network)
  return { address: deployment.address, txHash: deployment.txHash, verified: true }
}
export default deployContract`,
    category: 'Blockchain',
    tags: ['blockchain', 'smart-contracts', 'web3', 'ethereum', 'deployment', 'defi'],
    author: 'Web3 Builders',
    version: '2.3.0',
    downloads: 8932,
    rating: 4.8,
    reviews: 187,
    price: 39.99,
    isVerified: true,
    isPremium: true,
    createdAt: daysAgo(65),
    updatedAt: daysAgo(3),
    dependencies: [],
    paymentAddress: '0x7890123456ABCDEFabcdef7890123456ABCDEF78',
    x402Enabled: true,
    documentation: `# Smart Contract Deployer\n\nProfessional contract deployment.\n\n## Networks\n- Ethereum\n- Polygon\n- BSC\n- Arbitrum\n- Base\n\n## Features\n- Compilation\n- Gas optimization\n- Verification\n- Monitoring`
  },
  {
    id: 'mp-006',
    name: 'Customer Support AI Agent',
    description: 'Intelligent customer support with multi-channel support, sentiment analysis, ticket routing, knowledge base integration. Reduces support load by 60%.',
    code: `async function handleSupport(request: any) {
  const sentiment = await analyzeSentiment(request.message)
  if (sentiment.score < 0.3) return escalateToHuman(request)
  const response = await spark.llm(spark.llmPrompt\`Support response for: \${request.message}\`, 'gpt-4o')
  return { response, sentiment, resolved: true }
}
export default handleSupport`,
    category: 'Customer Service',
    tags: ['ai', 'support', 'chatbot', 'customer-service', 'automation', 'nlp'],
    author: 'SupportAI Inc',
    version: '3.4.2',
    downloads: 16789,
    rating: 4.9,
    reviews: 445,
    price: 44.99,
    isVerified: true,
    isPremium: true,
    createdAt: daysAgo(100),
    updatedAt: hoursAgo(36),
    dependencies: [],
    paymentAddress: '0x0123456789ABCDEFabcdef0123456789ABCDEF01',
    x402Enabled: true,
    documentation: `# Customer Support AI\n\nAI-powered support that scales.\n\n## Channels\n- Email\n- Live chat\n- Slack/Discord\n- SMS\n\n## Intelligence\n- Sentiment analysis\n- Smart routing\n- Knowledge base\n- 24/7 availability`
  },
  {
    id: 'mp-007',
    name: 'Social Media Manager Pro',
    description: 'Complete social media automation: content scheduling, hashtag optimization, engagement tracking, competitor analysis across all platforms.',
    code: `async function manageSocialMedia(config: any) {
  const results = []
  for (const platform of ['twitter', 'linkedin', 'instagram']) {
    if (config.schedule) results.push(await schedulePost(platform, config))
    if (config.analytics) results.push(await getAnalytics(platform))
  }
  return { results, summary: aggregateResults(results) }
}
export default manageSocialMedia`,
    category: 'Marketing',
    tags: ['social-media', 'marketing', 'automation', 'scheduling', 'analytics', 'engagement'],
    author: 'Social Growth Labs',
    version: '2.8.1',
    downloads: 21456,
    rating: 4.7,
    reviews: 534,
    price: 19.99,
    isVerified: true,
    isPremium: true,
    createdAt: daysAgo(85),
    updatedAt: daysAgo(1),
    dependencies: [],
    paymentAddress: '0x2345678901ABCDEFabcdef2345678901ABCDEF23',
    x402Enabled: true,
    documentation: `# Social Media Manager\n\nAll-in-one social automation.\n\n## Platforms\n- Twitter/X\n- LinkedIn\n- Instagram\n- Facebook\n- TikTok\n\n## Features\n- AI captions\n- Scheduling\n- Engagement\n- Analytics`
  },
  {
    id: 'mp-008',
    name: 'Machine Learning Model Trainer',
    description: 'Train, evaluate, and deploy ML models without deep expertise. AutoML features, hyperparameter tuning, model comparison, one-click deployment.',
    code: `async function trainModel(dataset: any, config: any) {
  const prepared = await prepareData(dataset)
  const models = ['random_forest', 'xgboost', 'neural_network']
  const results = await Promise.all(models.map(m => trainModelType(m, prepared)))
  const best = selectBestModel(results)
  return { model: best, deployment: await deployModel(best) }
}
export default trainModel`,
    category: 'Machine Learning',
    tags: ['ml', 'ai', 'training', 'automl', 'deployment', 'data-science'],
    author: 'ML Studio',
    version: '1.7.0',
    downloads: 9876,
    rating: 4.8,
    reviews: 234,
    price: 59.99,
    isVerified: true,
    isPremium: true,
    createdAt: daysAgo(70),
    updatedAt: daysAgo(5),
    dependencies: [],
    paymentAddress: '0x4567890123ABCDEFabcdef4567890123ABCDEF45',
    x402Enabled: true,
    documentation: `# ML Model Trainer\n\nProfessional ML training platform.\n\n## Models\n- Classification\n- Regression\n- Deep Learning\n- AutoML\n\n## Features\n- Auto feature engineering\n- Hyperparameter tuning\n- One-click deployment`
  },
  {
    id: 'mp-009',
    name: 'API Gateway & Rate Controller',
    description: 'Enterprise API management with authentication, rate limiting, caching, monitoring, analytics. Protect APIs and optimize performance.',
    code: `class APIGateway {
  async handleRequest(req: any) {
    if (!await this.authenticate(req)) return { status: 401 }
    if (!await this.checkRateLimit(req.userId)) return { status: 429 }
    const cached = this.cache.get(req.key)
    if (cached) return cached
    const response = await this.proxyRequest(req)
    this.cache.set(req.key, response)
    return response
  }
}
export default APIGateway`,
    category: 'Infrastructure',
    tags: ['api', 'gateway', 'rate-limiting', 'security', 'caching', 'monitoring'],
    author: 'API Systems',
    version: '3.1.0',
    downloads: 14532,
    rating: 4.7,
    reviews: 298,
    price: 29.99,
    isVerified: true,
    isPremium: true,
    createdAt: daysAgo(95),
    updatedAt: daysAgo(2),
    dependencies: [],
    paymentAddress: '0x6789012345ABCDEFabcdef6789012345ABCDEF67',
    x402Enabled: true,
    documentation: `# API Gateway\n\nEnterprise API management.\n\n## Features\n- Authentication (JWT, OAuth)\n- Rate limiting\n- Caching\n- Load balancing\n- Monitoring\n- DDoS protection`
  },
  {
    id: 'mp-010',
    name: 'Crypto Portfolio Tracker',
    description: 'Real-time cryptocurrency portfolio tracking with profit/loss calculation, tax reporting, price alerts, DeFi integration. Supports 5000+ coins.',
    code: `async function trackPortfolio(wallets: string[]) {
  const holdings = await getHoldings(wallets)
  const prices = await getCurrentPrices(holdings.assets)
  return {
    totalValue: calculateTotalValue(holdings, prices),
    holdings: holdings.assets.map(a => ({ ...a, value: a.amount * prices[a.symbol] })),
    defiPositions: await getDeFiPositions(wallets)
  }
}
export default trackPortfolio`,
    category: 'Blockchain',
    tags: ['crypto', 'portfolio', 'defi', 'tracking', 'trading', 'web3'],
    author: 'CryptoAnalytics',
    version: '2.6.3',
    downloads: 18765,
    rating: 4.8,
    reviews: 423,
    price: 9.99,
    isVerified: true,
    isPremium: true,
    createdAt: daysAgo(62),
    updatedAt: hoursAgo(12),
    dependencies: [],
    paymentAddress: '0xABCD123456789012345678901234567890ABCD12',
    x402Enabled: true,
    documentation: `# Crypto Portfolio Tracker\n\nProfessional portfolio management.\n\n## Coverage\n- 5000+ cryptocurrencies\n- NFTs\n- DeFi positions\n- Staking rewards\n\n## Features\n- Real-time tracking\n- Tax reporting\n- Price alerts\n- Analytics`
  },
  {
    id: 'mp-011',
    name: 'Email Marketing Automation',
    description: 'Complete email marketing platform: campaign builder, A/B testing, segmentation, personalization, analytics. Integrates with major ESP providers.',
    code: `async function sendCampaign(campaign: any) {
  const segments = await segmentAudience(campaign.audience)
  const personalized = await personalizeContent(campaign.template, segments)
  const results = []
  for (const segment of segments) {
    const emails = await buildEmails(personalized[segment.id], segment.contacts)
    results.push(await sendBatch(emails, segment.contacts))
  }
  return { sent: results.reduce((sum, r) => sum + r.sent, 0) }
}
export default sendCampaign`,
    category: 'Marketing',
    tags: ['email', 'marketing', 'automation', 'campaigns', 'analytics', 'personalization'],
    author: 'EmailPro Labs',
    version: '3.2.4',
    downloads: 15678,
    rating: 4.7,
    reviews: 389,
    price: 34.99,
    isVerified: true,
    isPremium: true,
    createdAt: daysAgo(105),
    updatedAt: daysAgo(1),
    dependencies: [],
    paymentAddress: '0xDEF1234567890123456789012345678901DEF123',
    x402Enabled: true,
    documentation: `# Email Marketing\n\nEnterprise email marketing platform.\n\n## Features\n- Drag-and-drop builder\n- A/B testing\n- Segmentation\n- Personalization\n- Analytics\n- ESP integration`
  },
  {
    id: 'mp-012',
    name: 'Video Processing Pipeline',
    description: 'Automated video processing: transcoding, thumbnail generation, subtitle extraction, compression, optimization. All major formats supported.',
    code: `async function processVideo(videoUrl: string, operations: any[]) {
  let video = await downloadVideo(videoUrl)
  for (const op of operations) {
    if (op.type === 'transcode') video = await transcode(video, op.format)
    if (op.type === 'compress') video = await compress(video, op.quality)
    if (op.type === 'thumbnail') await generateThumbnail(video, op.timestamp)
  }
  return uploadProcessed(video)
}
export default processVideo`,
    category: 'Media',
    tags: ['video', 'media', 'processing', 'transcoding', 'compression', 'automation'],
    author: 'MediaOps Studio',
    version: '1.9.0',
    downloads: 6754,
    rating: 4.6,
    reviews: 143,
    price: 29.99,
    isVerified: true,
    isPremium: true,
    createdAt: daysAgo(55),
    updatedAt: daysAgo(4),
    dependencies: [],
    paymentAddress: '0x9012345678ABCDEFabcdef9012345678ABCDEF90',
    x402Enabled: true,
    documentation: `# Video Processing\n\nProfessional video processing.\n\n## Operations\n- Transcoding (MP4, WebM, MOV)\n- Compression\n- Thumbnails\n- Subtitles\n- Watermarks\n\n## Storage\n- S3/CDN integration\n- Streaming formats`
  },
  {
    id: 'mp-013',
    name: 'Advanced Analytics Dashboard',
    description: 'Real-time analytics processing and visualization. Track metrics, generate insights, create custom reports with ML-powered predictions and anomaly detection.',
    code: `async function analyzeMetrics(dataSource: string, config: any) {
  const rawData = await fetchData(dataSource)
  const processed = await processData(rawData)
  return {
    metrics: processed,
    insights: await generateInsights(processed),
    predictions: await runPredictions(processed),
    anomalies: await detectAnomalies(processed)
  }
}
export default analyzeMetrics`,
    category: 'Analytics',
    tags: ['analytics', 'metrics', 'insights', 'ml', 'predictions', 'visualization'],
    author: 'DataViz Pro',
    version: '4.1.2',
    downloads: 13245,
    rating: 4.7,
    reviews: 312,
    price: 34.99,
    isVerified: true,
    isPremium: true,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(2),
    dependencies: ['d3@^7.0.0'],
    paymentAddress: '0x5678901234ABCDEFabcdef5678901234ABCDEF56',
    x402Enabled: true,
    documentation: `# Advanced Analytics\n\nEnterprise analytics with ML.\n\n## Sources\n- Google Analytics\n- Mixpanel\n- Custom APIs\n- Databases\n\n## Features\n- Predictive analytics\n- Anomaly detection\n- Custom dashboards\n- D3.js visualizations`
  },
  {
    id: 'mp-014',
    name: 'PDF Document Processor',
    description: 'Extract text, tables, images from PDFs. Convert, merge, split, watermark, OCR documents. Batch processing with high accuracy.',
    code: `async function processPDF(pdfPath: string, operations: any[]) {
  const document = await loadPDF(pdfPath)
  const results: any = {}
  for (const op of operations) {
    if (op.type === 'extract_text') results.text = await extractText(document)
    if (op.type === 'extract_tables') results.tables = await extractTables(document)
    if (op.type === 'ocr') results.ocr = await performOCR(document)
    if (op.type === 'merge') results.merged = await mergePDFs([document, ...op.others])
  }
  return results
}
export default processPDF`,
    category: 'Utilities',
    tags: ['pdf', 'documents', 'ocr', 'extraction', 'conversion', 'automation'],
    author: 'DocTools Pro',
    version: '2.4.0',
    downloads: 11234,
    rating: 4.6,
    reviews: 267,
    price: 14.99,
    isVerified: true,
    isPremium: true,
    createdAt: daysAgo(80),
    updatedAt: daysAgo(6),
    dependencies: [],
    paymentAddress: '0x8901234567ABCDEFabcdef8901234567ABCDEF89',
    x402Enabled: true,
    documentation: `# PDF Processor\n\nComprehensive PDF processing.\n\n## Extraction\n- Text (with formatting)\n- Tables (to CSV/Excel)\n- Images\n\n## OCR\n- 100+ languages\n- Handwriting recognition\n- 99%+ accuracy\n\n## Operations\n- Convert to Word/Excel\n- Merge/split\n- Watermarks\n- Compression`
  }
]
