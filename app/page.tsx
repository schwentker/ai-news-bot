"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Rocket,
  Play,
  TestTube,
  Eye,
  FileText,
  Clock,
  X,
  Search,
  BarChart3,
  Settings,
  Grid3X3,
  PenTool,
  ChevronRight,
} from "lucide-react"

interface TabType {
  id: string
  label: string
  icon: React.ReactNode
}

interface Story {
  id: string
  title: string
  summary: string
  source: string
  url: string
  publishedAt: string
  relevanceScore?: number
}
interface Query {
  id: string
  text: string
  status: "running" | "complete" | "pending"
  sources: string[]
  storiesFound: number
  timeStarted: string
  results?: Story[]
}

interface ActivityItem {
  id: string
  type: "collection" | "research" | "blog"
  title: string
  timestamp: string
  status: "complete" | "running" | "error"
  details: string
}

export default function MissionControlDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [botStatus, setBotStatus] = useState<"idle" | "running" | "complete" | "error">("idle")
  const [isCollecting, setIsCollecting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [customQuery, setCustomQuery] = useState("")
  const [logs, setLogs] = useState<string[]>([])

  const [queries, setQueries] = useState<Query[]>([
    {
      id: "1",
      text: "Perplexity browser Comet updates",
      status: "complete",
      sources: ["Reddit", "NewsAPI"],
      storiesFound: 12,
      timeStarted: "2 hours ago",
    },
    {
      id: "2",
      text: "Claude agent builder features",
      status: "running",
      sources: ["Reddit", "Perplexity"],
      storiesFound: 8,
      timeStarted: "30 minutes ago",
    },
    {
      id: "3",
      text: "OpenAI o3 model capabilities",
      status: "pending",
      sources: ["NewsAPI", "Perplexity"],
      storiesFound: 0,
      timeStarted: "Just now",
    },
  ])

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([
    {
      id: "1",
      type: "collection",
      title: "Daily AI Collection",
      timestamp: "2 hours ago",
      status: "complete",
      details: "47 stories collected, 12 selected",
    },
    {
      id: "2",
      type: "research",
      title: "Perplexity browser research",
      timestamp: "3 hours ago",
      status: "complete",
      details: "12 stories found from 2 sources",
    },
    {
      id: "3",
      type: "blog",
      title: "Weekly AI Roundup",
      timestamp: "1 day ago",
      status: "complete",
      details: "Blog post generated and published",
    },
  ])

  const [breadcrumb, setBreadcrumb] = useState<string[]>(["Dashboard"])
  const [researchQuery, setResearchQuery] = useState("")
  const [timeRange, setTimeRange] = useState("24h")
  const [selectedSources, setSelectedSources] = useState<string[]>(["Reddit", "NewsAPI"])

  const tabs: TabType[] = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "research", label: "Research", icon: <Search className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
    { id: "results", label: "Results", icon: <Grid3X3 className="w-4 h-4" /> },
    { id: "blog", label: "Blog Generator", icon: <PenTool className="w-4 h-4" /> },
  ]

  const navigateToTab = (tabId: string, queryText?: string) => {
    setActiveTab(tabId)

    // Update breadcrumb
    const tabLabels: Record<string, string> = {
      dashboard: "Dashboard",
      research: "Research",
      results: "Results",
      blog: "Blog Generator",
      settings: "Settings",
    }

    setBreadcrumb(["Dashboard", tabLabels[tabId]].filter(Boolean))

    // Pass query text to research tab
    if (tabId === "research" && queryText) {
      setResearchQuery(queryText)
      setCustomQuery(queryText)
    }
  }

  const handleStartCollection = () => {
    setIsCollecting(true)
    setBotStatus("running")
    setProgress(0)
    setLogs([])

    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      type: "collection",
      title: "Daily AI Collection",
      timestamp: "Just now",
      status: "running",
      details: "Collection in progress...",
    }
    setRecentActivity((prev) => [newActivity, ...prev.slice(0, 2)])

    const steps = [
      { step: "Initializing collection...", progress: 10 },
      { step: "Fetching from Reddit... (1/3 sources)", progress: 25 },
      { step: "Found 15 stories from r/MachineLearning", progress: 40 },
      { step: "Fetching from NewsAPI... (2/3 sources)", progress: 60 },
      { step: "Found 23 stories from NewsAPI", progress: 75 },
      { step: "Fetching from Perplexity... (3/3 sources)", progress: 90 },
      { step: "Found 8 stories from Perplexity", progress: 95 },
      { step: "Processing and ranking stories...", progress: 100 },
    ]

    let stepIndex = 0
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const currentStepData = steps[stepIndex]
        setCurrentStep(currentStepData.step)
        setProgress(currentStepData.progress)
        setLogs((prev) => [...prev, currentStepData.step])
        stepIndex++
      } else {
        clearInterval(interval)
        setBotStatus("complete")
        setIsCollecting(false)
        setCurrentStep("Collection complete")

        setRecentActivity((prev) =>
          prev.map((activity) =>
            activity.type === "collection" && activity.status === "running"
              ? { ...activity, status: "complete" as const, details: "46 stories collected, 15 selected" }
              : activity,
          ),
        )
      }
    }, 800)
  }

  const handleCancel = () => {
    setIsCollecting(false)
    setBotStatus("idle")
    setProgress(0)
    setCurrentStep("")
    setLogs([])
  }

  const getStatusDisplay = () => {
    switch (botStatus) {
      case "idle":
        return { text: "Idle", class: "status-idle" }
      case "running":
        return { text: "Running", class: "status-running animate-pulse" }
      case "complete":
        return { text: "Complete", class: "status-complete" }
      case "error":
        return { text: "Error", class: "status-error" }
    }
  }

  const handleCustomResearch = () => {
    if (customQuery.trim()) {
      navigateToTab("research", customQuery.trim())
    }
  }

  const handleStartResearch = () => {
    if (researchQuery.trim()) {
      const newQuery: Query = {
        id: Date.now().toString(),
        text: researchQuery,
        status: "running",
        sources: selectedSources,
        storiesFound: 0,
        timeStarted: "Just now",
      }

      setQueries((prev) => [newQuery, ...prev])

      // Add to recent activity
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: "research",
        title: researchQuery,
        timestamp: "Just now",
        status: "running",
        details: `Searching ${selectedSources.join(", ")}`,
      }
      setRecentActivity((prev) => [newActivity, ...prev.slice(0, 2)])

      // Simulate research completion
      setTimeout(() => {
        setQueries((prev) =>
          prev.map((q) =>
            q.id === newQuery.id
              ? { ...q, status: "complete" as const, storiesFound: Math.floor(Math.random() * 20) + 5 }
              : q,
          ),
        )

        setRecentActivity((prev) =>
          prev.map((activity) =>
            activity.id === newActivity.id
              ? {
                  ...activity,
                  status: "complete" as const,
                  details: `Found ${Math.floor(Math.random() * 20) + 5} stories`,
                }
              : activity,
          ),
        )
      }, 3000)
    }
  }

  const statusDisplay = getStatusDisplay()

  const renderTabContent = () => {
    switch (activeTab) {
      case "research":
        return (
          <div className="space-y-8">
            {/* Query Input Section */}
            <div className="control-card">
              <h2 className="text-xl font-semibold mb-6">Custom Research Query</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">What would you like me to research?</label>
                  <Textarea
                    value={researchQuery}
                    onChange={(e) => setResearchQuery(e.target.value)}
                    placeholder="Enter your research query here..."
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Time Range</label>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">Last 24 hours</SelectItem>
                        <SelectItem value="week">Last week</SelectItem>
                        <SelectItem value="all">All time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Sources</label>
                    <div className="flex flex-wrap gap-4">
                      {["Reddit", "NewsAPI", "Perplexity"].map((source) => (
                        <div key={source} className="flex items-center space-x-2">
                          <Checkbox
                            id={source}
                            checked={selectedSources.includes(source)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSources((prev) => [...prev, source])
                              } else {
                                setSelectedSources((prev) => prev.filter((s) => s !== source))
                              }
                            }}
                          />
                          <label htmlFor={source} className="text-sm">
                            {source}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleStartResearch}
                  disabled={!researchQuery.trim() || selectedSources.length === 0}
                  className="primary-action-button"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Start Research
                </Button>
              </div>
            </div>

            {/* Active Queries Section */}
            <div className="control-card">
              <h2 className="text-xl font-semibold mb-6">Active & Recent Queries</h2>
              <div className="space-y-4">
                {queries.map((query) => (
                  <div
                    key={query.id}
                    className="border border-border rounded-lg p-4 hover:bg-secondary/5 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{query.text}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              query.status === "running"
                                ? "bg-blue-100 text-blue-800"
                                : query.status === "complete"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {query.status}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Sources: {query.sources.join(", ")} • {query.storiesFound} stories found • {query.timeStarted}
                        </div>
                      </div>
                      {query.status === "complete" && (
                        <Button variant="outline" size="sm" onClick={() => navigateToTab("results")}>
                          View Results
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case "settings":
        return (
          <div className="control-card">
            <h2 className="text-xl font-semibold mb-6">Configuration</h2>
            <p className="text-muted-foreground">Settings panel coming soon...</p>
          </div>
        )
      case "results":
        return (
          <div className="control-card">
            <h2 className="text-xl font-semibold mb-6">Story Results</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Latest collection results</p>
                <Button onClick={() => navigateToTab("blog")} className="start-button">
                  <PenTool className="w-4 h-4 mr-2" />
                  Generate Blog
                </Button>
              </div>
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Sample Story {i}</h3>
                    <p className="text-sm text-muted-foreground">Story preview content...</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case "blog":
        return (
          <div className="control-card">
            <h2 className="text-xl font-semibold mb-6">Blog Generator</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">Transform your collected stories into engaging blog content.</p>
              <div className="flex gap-4">
                <Button onClick={() => navigateToTab("results")} variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Review Stories
                </Button>
                <Button onClick={() => navigateToTab("dashboard")} className="start-button">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <>
            {/* Main Action Panel */}
            <div className="control-card">
              <div className="text-center space-y-6">
                <Button
                  onClick={handleStartCollection}
                  disabled={isCollecting}
                  className="primary-action-button hover:scale-105 transition-transform"
                >
                  <Play className="w-6 h-6 mr-3" />
                  {isCollecting ? "Collection Running..." : "Start Daily Collection"}
                </Button>

                <div className="max-w-md mx-auto">
                  <Input
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCustomResearch()}
                    placeholder="What would you like me to research today?"
                    className="custom-input text-center"
                  />
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="quick-action-button hover:bg-secondary/20 transition-colors">
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Sources
                  </Button>
                  <Button
                    className="quick-action-button hover:bg-secondary/20 transition-colors"
                    onClick={() => navigateToTab("results")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Last Results
                  </Button>
                  <Button
                    className="quick-action-button hover:bg-secondary/20 transition-colors"
                    onClick={() => navigateToTab("blog")}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Blog
                  </Button>
                </div>
              </div>
            </div>

            {/* Progress Section - Only shows when running */}
            {isCollecting && (
              <div className="progress-section">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Collection Progress</h3>
                  <Button onClick={handleCancel} className="cancel-button hover:bg-destructive/20">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>{currentStep}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {logs.map((log, index) => (
                      <div key={index} className="log-entry animate-in slide-in-from-left">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Overview Cards */}
            <div className="stats-grid">
              <div className="stat-card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">AI Weekly</h3>
                    <BarChart3 className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="stat-number">47</div>
                    <div className="stat-label">stories today</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-foreground">12</div>
                    <div className="stat-label">selected</div>
                  </div>
                  <Button className="view-button w-full hover:bg-secondary/20" onClick={() => navigateToTab("results")}>
                    View Stories
                  </Button>
                </div>
              </div>

              <div className="stat-card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Custom Research</h3>
                    <Search className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="stat-number">{queries.filter((q) => q.status === "running").length}</div>
                    <div className="stat-label">active queries</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-foreground">
                      {queries.filter((q) => q.timeStarted.includes("hour") || q.timeStarted === "Just now").length}
                    </div>
                    <div className="stat-label">queries today</div>
                  </div>
                  <Button className="start-button w-full hover:bg-primary/20" onClick={() => navigateToTab("research")}>
                    New Query
                  </Button>
                </div>
              </div>

              <div className="stat-card">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Recent Activity</h3>
                    <Clock className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="activity-timeline">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="timeline-item">
                        <div
                          className={`timeline-dot ${
                            activity.status === "complete"
                              ? "bg-green-500"
                              : activity.status === "running"
                                ? "bg-blue-500 animate-pulse"
                                : "bg-red-500"
                          }`}
                        />
                        <div className="text-sm">
                          <div className="font-medium text-foreground">{activity.title}</div>
                          <div className="text-muted-foreground">{activity.details}</div>
                          <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <header className="mission-control-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Rocket className="w-8 h-8 text-secondary" />
                <h1 className="text-2xl font-bold text-primary-foreground">AI News Bot</h1>
              </div>
              <div className={`status-indicator ${statusDisplay.class}`}>
                <div className="w-2 h-2 rounded-full bg-current" />
                {statusDisplay.text}
              </div>
            </div>
            <div className="text-sm text-primary-foreground/70">Last collection: 2 hours ago</div>
          </div>

          {breadcrumb.length > 1 && (
            <div className="flex items-center gap-2 mt-3 text-sm text-primary-foreground/70">
              {breadcrumb.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="w-3 h-3" />}
                  <span className={index === breadcrumb.length - 1 ? "text-primary-foreground" : ""}>{crumb}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="nav-tabs overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigateToTab(tab.id)}
                className={`nav-tab flex items-center gap-2 ${
                  activeTab === tab.id ? "nav-tab-active" : "nav-tab-inactive"
                } hover:bg-secondary/10 transition-colors`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">{renderTabContent()}</main>
    </div>
  )
}
