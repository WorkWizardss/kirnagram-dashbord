import { useState, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { MetricChip } from "@/components/admin/MetricChip";
import { MetricStatsBar } from "@/components/admin/MetricStatsBar";
import { UnifiedChart } from "@/components/admin/UnifiedChart";
import { TrafficChart } from "@/components/admin/TrafficChart";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Upload,
  CheckCircle,
  XCircle,
  Edit,
  ArrowDownCircle,
  ArrowUpCircle,
  Image,
  Video,
  Users,
} from "lucide-react";
import { toast } from "sonner";

const MAX_SELECTIONS = 5;

interface MetricConfig {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeLabel?: string;
  icon: React.ReactNode;
  lineColor: string;
}

const metrics: MetricConfig[] = [
  { id: "likes", title: "Likes", value: 128450, change: 12.5, icon: <Heart className="w-4 h-4" />, lineColor: "#f43f5e" },
  { id: "comments", title: "Comments", value: 45230, change: 8.2, icon: <MessageCircle className="w-4 h-4" />, lineColor: "#8b5cf6" },
  { id: "shares", title: "Shares", value: 28940, change: 15.3, icon: <Share2 className="w-4 h-4" />, lineColor: "#06b6d4" },
  { id: "saves", title: "Saves", value: 67820, change: 9.8, icon: <Bookmark className="w-4 h-4" />, lineColor: "#10b981" },
  { id: "uploads", title: "Uploads", value: 3240, change: 22.1, icon: <Upload className="w-4 h-4" />, lineColor: "#f97316" },
  { id: "acceptedPrompts", title: "Accepted", value: 18650, change: 18.4, icon: <CheckCircle className="w-4 h-4" />, lineColor: "#22c55e" },
  { id: "rejectedPrompts", title: "Rejected", value: 1890, change: -5.2, icon: <XCircle className="w-4 h-4" />, lineColor: "#ef4444" },
  { id: "modifications", title: "Edits", value: 5420, change: 11.7, icon: <Edit className="w-4 h-4" />, lineColor: "#eab308" },
  { id: "withdraws", title: "Withdrawals", value: "$38,450", change: 14.2, icon: <ArrowDownCircle className="w-4 h-4" />, lineColor: "#64748b" },
  { id: "recharges", title: "Recharges", value: "$98,200", change: 25.8, icon: <ArrowUpCircle className="w-4 h-4" />, lineColor: "#14b8a6" },
  { id: "images", title: "Images", value: 42350, change: 32.4, icon: <Image className="w-4 h-4" />, lineColor: "#6366f1" },
  { id: "videos", title: "Videos", value: 8920, change: 45.6, icon: <Video className="w-4 h-4" />, lineColor: "#d946ef" },
  { id: "newUsers", title: "New Users", value: 1350, change: 28.9, icon: <Users className="w-4 h-4" />, lineColor: "#3b82f6" },
];

const Index = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const handleToggle = useCallback((id: string) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(id)) {
        return prev.filter((m) => m !== id);
      }
      if (prev.length >= MAX_SELECTIONS) {
        toast.error(`Maximum ${MAX_SELECTIONS} metrics can be selected`, {
          description: "Deselect one first.",
        });
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const selectedMetricConfigs = selectedMetrics.map((id) => {
    const metric = metrics.find((m) => m.id === id)!;
    return { id: metric.id, title: metric.title, color: metric.lineColor };
  });

  const selectedStats = selectedMetrics.map((id) => {
    const metric = metrics.find((m) => m.id === id)!;
    return { title: metric.title, value: metric.value, change: metric.change, color: metric.lineColor };
  });

  const isMaxSelected = selectedMetrics.length >= MAX_SELECTIONS;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Select up to {MAX_SELECTIONS} metrics to compare •{" "}
            <span className="text-primary font-medium">{selectedMetrics.length}/{MAX_SELECTIONS}</span>
          </p>
        </div>

        {/* Metric Chips */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex flex-wrap gap-2">
            {metrics.map((metric) => (
              <MetricChip
                key={metric.id}
                id={metric.id}
                title={metric.title}
                icon={metric.icon}
                color={metric.lineColor}
                isSelected={selectedMetrics.includes(metric.id)}
                onToggle={handleToggle}
                disabled={isMaxSelected && !selectedMetrics.includes(metric.id)}
              />
            ))}
          </div>
        </div>

        {/* Selected Metrics Stats */}
        <MetricStatsBar metrics={selectedStats} />

        {/* Unified Chart */}
        <UnifiedChart selectedMetrics={selectedMetricConfigs} />

        {/* Traffic Chart */}
        <TrafficChart />
      </div>
    </AdminLayout>
  );
};

export default Index;
