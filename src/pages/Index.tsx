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

import { useEffect } from "react";
// ...existing code...

const metricIcons: Record<string, React.ReactNode> = {
  likes: <Heart className="w-4 h-4" />,
  comments: <MessageCircle className="w-4 h-4" />,
  shares: <Share2 className="w-4 h-4" />,
  posts: <Upload className="w-4 h-4" />,
  editPrompts: <Edit className="w-4 h-4" />,
  acceptedPrompts: <CheckCircle className="w-4 h-4" />,
  rejectedPrompts: <XCircle className="w-4 h-4" />,
  withdrawRequests: <ArrowDownCircle className="w-4 h-4" />,
  totalUsers: <Users className="w-4 h-4" />,
};

const metricColors: Record<string, string> = {
  likes: "#f43f5e",
  comments: "#8b5cf6",
  shares: "#06b6d4",
  posts: "#f97316",
  editPrompts: "#eab308",
  acceptedPrompts: "#22c55e",
  rejectedPrompts: "#ef4444",
  withdrawRequests: "#64748b",
  totalUsers: "#3b82f6",
};

const metricTitles: Record<string, string> = {
  likes: "Likes",
  comments: "Comments",
  shares: "Shares",
  posts: "Posts",
  editPrompts: "Edit Prompts",
  acceptedPrompts: "Accepted Prompts",
  rejectedPrompts: "Rejected Prompts",
  withdrawRequests: "Withdraw Requests",
  totalUsers: "Total Users",
};

const metricOrder = [
  "likes",
  "comments",
  "shares",
  "posts",
  "editPrompts",
  "acceptedPrompts",
  "rejectedPrompts",
  "withdrawRequests",
  "totalUsers",
];

const Index = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/admin/dashboard/metrics")
      .then((res) => res.json())
      .then((data) => {
        setMetrics({
          likes: data.total_likes,
          comments: data.total_comments,
          shares: data.total_shares,
          posts: data.total_posts,
          editPrompts: data.edit_prompts,
          acceptedPrompts: data.accepted_prompts,
          rejectedPrompts: data.rejected_prompts,
          withdrawRequests: data.withdraw_requests,
          totalUsers: data.total_users,
        });
      });
  }, []);

const metricConfigs: MetricConfig[] = metricOrder.map((id) => ({
  id,
  title: metricTitles[id],
  value: metrics[id] ?? 0,
  change: 0, // You can update this if you have change data
  icon: metricIcons[id],
  lineColor: metricColors[id],
}));

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
    const metric = metricConfigs.find((m) => m.id === id)!;
    return { id: metric.id, title: metric.title, color: metric.lineColor };
  });

  const selectedStats = selectedMetrics.map((id) => {
    const metric = metricConfigs.find((m) => m.id === id)!;
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
            {metricConfigs.map((metric) => (
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
