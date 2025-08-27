"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Clock, Globe, Eye, Download, Plus, ChevronDown, ExternalLink, BookOpen } from "lucide-react"

interface Query {
  id: string
  text: string
  sources: string[]
  timeRange: string
  status: "running" | "completed" | "failed"
  progress: number
  storiesFound: number
  timeStarted: string
}

interface Story {
  id: string
  title: string
  summary: string
  source: string
  relevanceScore: number
  publishedAt: string
  url: string
}

export default function CustomResearchInterface() {
  const [queryText, setQueryText] = useState("")
  const [selectedSources, setSelectedSources] = useState<string[]>(["reddit", "perplexity"])
  const [timeRange, setTimeRange] = useState("24h")
  const [showExamples, setShowExamples] = useState(false)

  const examplePrompts = [
    "Perplexity browser Comet",
    "Claude agent builder",
    "OpenAI o3 model",
    "Anthropic Constitutional AI",
    "Google Gemini updates",
    "Meta LLaMA developments",
  ]

  const activeQueries: Query[] = [
    {
      id: "1",
      text: "Perplexity browser Comet analysis",
      sources: ["Reddit", "Perplexity"],
      timeRange: "Last 24h",
      status: "running",
      progress: 65,
      storiesFound: 8,
      timeStarted: "2 minutes ago",
    },
    {
      id: "2",
      text: "Claude agent builder capabilities",
      sources: ["Reddit", "NewsAPI"],
      timeRange: "Last week",
      status: "completed",
      progress: 100,
      storiesFound: 23,
      timeStarted: "1 hour ago",
    },
  ]

  const mockStories: Story[] = [
    {
      id: "1",
      title: "Perplexity Launches Revolutionary Browser with AI-Powered Search Integration",
      summary:
        "The new Perplexity browser 'Comet' introduces seamless AI search capabilities directly into the browsing experience, potentially disrupting traditional search paradigms.",
      source: "TechCrunch",
      relevanceScore: 95,
      publishedAt: "2 hours ago",
      url: "#",
    },
    {
      id: "2",
      title: "Early Beta Users Report Impressive Performance Gains with Perplexity Comet",
      summary:
        "Initial testing shows significant improvements in search accuracy and response time compared to traditional browsers, with users praising the intuitive AI integration.",
      source: "r/MachineLearning",
      relevanceScore: 87,
      publishedAt: "4 hours ago",
      url: "#",
    },
    {
      id: "3",
      title: "Industry Analysis: How Perplexity's Browser Could Challenge Google's Dominance",
      summary:
        "Market experts weigh in on the potential impact of AI-native browsing experiences on the current search engine landscape and user behavior patterns.",
      source: "Ars Technica",
      relevanceScore: 78,
      publishedAt: "6 hours ago",
      url: "#",
    },
  ]

  const handleSourceToggle = (source: string) => {
    setSelectedSources((prev) => (prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]))
  }

  const getRelevanceScoreClass = (score: number) => {
    if (score >= 90) return "score-high"
    if (score >= 70) return "score-medium"
    return "score-low"
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="research-header">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Research Assistant</h1>
            </div>
            <div className="text-sm text-muted-foreground">Custom News Queries</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Query Input Section */}
        <div className="query-section">
          <h2 className="text-xl font-semibold text-foreground mb-6">What would you like me to research?</h2>

          <div className="space-y-6">
            <div>
              <Textarea
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Enter your research query here... e.g., 'Latest developments in AI browser technology' or 'OpenAI o3 model capabilities and benchmarks'"
                className="query-textarea"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Button variant="outline" onClick={() => setShowExamples(!showExamples)} className="example-dropdown">
                  Example Prompts <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                {showExamples && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-10">
                    <div className="p-2 space-y-1">
                      {examplePrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQueryText(prompt)
                            setShowExamples(false)
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground rounded transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="time-selector">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="week">Last week</SelectItem>
                    <SelectItem value="month">Last month</SelectItem>
                    <SelectItem value="all">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-3">Sources to Use</label>
                <div className="flex flex-wrap gap-4">
                  {["reddit", "perplexity", "newsapi", "arxiv"].map((source) => (
                    <label key={source} className="source-checkbox">
                      <Checkbox
                        checked={selectedSources.includes(source)}
                        onCheckedChange={() => handleSourceToggle(source)}
                      />
                      <span className="capitalize">{source}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button className="research-button">
                <Search className="w-5 h-5 mr-2" />
                Start Research
              </Button>
            </div>
          </div>
        </div>

        {/* Active Queries Section */}
        <div className="active-queries-section">
          <h2 className="text-xl font-semibold text-foreground mb-6">Active & Recent Queries</h2>

          <div className="space-y-4">
            {activeQueries.map((query) => (
              <div key={query.id} className="query-item">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{query.text}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>Sources: {query.sources.join(", ")}</span>
                      <span>•</span>
                      <span>{query.timeRange}</span>
                      <span>•</span>
                      <span>{query.storiesFound} stories found</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {query.timeStarted}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {query.status === "running" && <span className="text-xs text-primary font-medium">Running...</span>}
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View Results
                    </Button>
                  </div>
                </div>

                {query.status === "running" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{query.progress}%</span>
                    </div>
                    <div className="query-progress">
                      <div className="query-progress-fill" style={{ width: `${query.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Results Preview */}
        <div className="results-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Results Preview</h2>
            <div className="flex items-center gap-2">
              <Button className="export-button">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {mockStories.map((story) => (
              <div key={story.id} className="story-card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer">{story.title}</h3>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{story.summary}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {story.source}
                        </span>
                        <span>{story.publishedAt}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`relevance-score ${getRelevanceScoreClass(story.relevanceScore)}`}>
                          {story.relevanceScore}% relevant
                        </span>
                        <Button size="sm" className="add-to-queue-button">
                          <Plus className="w-3 h-3 mr-1" />
                          Add to Queue
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
