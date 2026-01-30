import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TimelineFilter, TimelinePreset } from "./TimelineFilter";

interface MetricConfig {
  id: string;
  title: string;
  color: string;
}

interface UnifiedChartProps {
  selectedMetrics: MetricConfig[];
}

// Generate data for different time ranges
const generateData = (preset: TimelinePreset) => {
  const baseMultiplier = {
    live: 0.05,
    today: 0.1,
    yesterday: 0.1,
    "7days": 0.3,
    "30days": 1,
    "90days": 2.5,
    custom: 1,
  }[preset];

  if (preset === "live" || preset === "today") {
    // Hourly data for today/live
    return Array.from({ length: 24 }, (_, i) => ({
      period: `${i.toString().padStart(2, "0")}:00`,
      likes: Math.floor((400 + Math.random() * 200) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      comments: Math.floor((150 + Math.random() * 80) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      shares: Math.floor((80 + Math.random() * 40) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      saves: Math.floor((200 + Math.random() * 100) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      uploads: Math.floor((20 + Math.random() * 15) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      acceptedPrompts: Math.floor((50 + Math.random() * 30) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      rejectedPrompts: Math.floor((5 + Math.random() * 5) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      modifications: Math.floor((15 + Math.random() * 10) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      withdraws: Math.floor((800 + Math.random() * 400) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      recharges: Math.floor((2000 + Math.random() * 1000) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      images: Math.floor((100 + Math.random() * 50) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      videos: Math.floor((25 + Math.random() * 15) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      newUsers: Math.floor((30 + Math.random() * 20) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
    }));
  }

  if (preset === "yesterday") {
    return Array.from({ length: 24 }, (_, i) => ({
      period: `${i.toString().padStart(2, "0")}:00`,
      likes: Math.floor((380 + Math.random() * 180) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      comments: Math.floor((140 + Math.random() * 70) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      shares: Math.floor((75 + Math.random() * 35) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      saves: Math.floor((180 + Math.random() * 90) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      uploads: Math.floor((18 + Math.random() * 12) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      acceptedPrompts: Math.floor((45 + Math.random() * 25) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      rejectedPrompts: Math.floor((4 + Math.random() * 4) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      modifications: Math.floor((12 + Math.random() * 8) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      withdraws: Math.floor((750 + Math.random() * 350) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      recharges: Math.floor((1800 + Math.random() * 900) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      images: Math.floor((90 + Math.random() * 45) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      videos: Math.floor((22 + Math.random() * 12) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
      newUsers: Math.floor((28 + Math.random() * 18) * (i < 6 ? 0.3 : i < 12 ? 0.7 : i < 18 ? 1 : 0.8)),
    }));
  }

  if (preset === "7days") {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, i) => ({
      period: day,
      likes: Math.floor((2800 + Math.random() * 1200) * (i < 5 ? 1 : 0.7)),
      comments: Math.floor((1000 + Math.random() * 500) * (i < 5 ? 1 : 0.7)),
      shares: Math.floor((550 + Math.random() * 250) * (i < 5 ? 1 : 0.7)),
      saves: Math.floor((1400 + Math.random() * 600) * (i < 5 ? 1 : 0.7)),
      uploads: Math.floor((120 + Math.random() * 60) * (i < 5 ? 1 : 0.7)),
      acceptedPrompts: Math.floor((350 + Math.random() * 150) * (i < 5 ? 1 : 0.7)),
      rejectedPrompts: Math.floor((35 + Math.random() * 20) * (i < 5 ? 1 : 0.7)),
      modifications: Math.floor((100 + Math.random() * 50) * (i < 5 ? 1 : 0.7)),
      withdraws: Math.floor((5500 + Math.random() * 2500) * (i < 5 ? 1 : 0.7)),
      recharges: Math.floor((14000 + Math.random() * 6000) * (i < 5 ? 1 : 0.7)),
      images: Math.floor((700 + Math.random() * 300) * (i < 5 ? 1 : 0.7)),
      videos: Math.floor((180 + Math.random() * 80) * (i < 5 ? 1 : 0.7)),
      newUsers: Math.floor((200 + Math.random() * 100) * (i < 5 ? 1 : 0.7)),
    }));
  }

  // Monthly data for 30/90 days
  const months = preset === "90days" 
    ? ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
    : ["Week 1", "Week 2", "Week 3", "Week 4"];
  
  return months.map((period, i) => ({
    period,
    likes: Math.floor((4200 + i * 800 + Math.random() * 1500) * baseMultiplier),
    comments: Math.floor((2400 + i * 400 + Math.random() * 800) * baseMultiplier),
    shares: Math.floor((1800 + i * 300 + Math.random() * 600) * baseMultiplier),
    saves: Math.floor((2800 + i * 500 + Math.random() * 1000) * baseMultiplier),
    uploads: Math.floor((320 + i * 80 + Math.random() * 150) * baseMultiplier),
    acceptedPrompts: Math.floor((850 + i * 200 + Math.random() * 400) * baseMultiplier),
    rejectedPrompts: Math.floor((120 + i * 20 + Math.random() * 50) * baseMultiplier),
    modifications: Math.floor((230 + i * 60 + Math.random() * 100) * baseMultiplier),
    withdraws: Math.floor((12500 + i * 3000 + Math.random() * 5000) * baseMultiplier),
    recharges: Math.floor((28000 + i * 7000 + Math.random() * 12000) * baseMultiplier),
    images: Math.floor((1200 + i * 300 + Math.random() * 500) * baseMultiplier),
    videos: Math.floor((450 + i * 100 + Math.random() * 200) * baseMultiplier),
    newUsers: Math.floor((320 + i * 80 + Math.random() * 150) * baseMultiplier),
  }));
};

export function UnifiedChart({ selectedMetrics }: UnifiedChartProps) {
  const [timelinePreset, setTimelinePreset] = useState<TimelinePreset>("30days");

  const chartData = useMemo(() => generateData(timelinePreset), [timelinePreset]);

  const handleRangeChange = (preset: TimelinePreset) => {
    setTimelinePreset(preset);
  };

  if (selectedMetrics.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-display font-semibold text-foreground">
              Unified Analytics View
            </h3>
            <p className="text-sm text-muted-foreground">
              Select metrics above to visualize trends
            </p>
          </div>
          <TimelineFilter onRangeChange={handleRangeChange} />
        </div>
        <div className="h-80 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-display font-semibold text-foreground mb-2">
            Select Metrics to Compare
          </h3>
          <p className="text-muted-foreground max-w-md">
            Click on the stat cards above to add them to the chart. You can select up to 5 metrics to compare at once.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-display font-semibold text-foreground">
              Unified Analytics View
            </h3>
            <p className="text-sm text-muted-foreground">
              Comparing {selectedMetrics.length} metric{selectedMetrics.length > 1 ? "s" : ""} over time
            </p>
          </div>
          <TimelineFilter onRangeChange={handleRangeChange} />
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedMetrics.map((metric) => (
            <div
              key={metric.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: metric.color }}
              />
              <span className="text-xs font-medium text-foreground">
                {metric.title}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="period"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend />
            {selectedMetrics.map((metric) => (
              <Line
                key={metric.id}
                type="monotone"
                dataKey={metric.id}
                name={metric.title}
                stroke={metric.color}
                strokeWidth={2.5}
                dot={{ fill: metric.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
