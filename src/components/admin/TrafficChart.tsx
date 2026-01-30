import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const data = [
  { hour: "00:00", traffic: 420 },
  { hour: "01:00", traffic: 280 },
  { hour: "02:00", traffic: 180 },
  { hour: "03:00", traffic: 120 },
  { hour: "04:00", traffic: 90 },
  { hour: "05:00", traffic: 150 },
  { hour: "06:00", traffic: 320 },
  { hour: "07:00", traffic: 580 },
  { hour: "08:00", traffic: 820 },
  { hour: "09:00", traffic: 1100 },
  { hour: "10:00", traffic: 1350 },
  { hour: "11:00", traffic: 1480 },
  { hour: "12:00", traffic: 1620 },
  { hour: "13:00", traffic: 1550 },
  { hour: "14:00", traffic: 1680 },
  { hour: "15:00", traffic: 1720 },
  { hour: "16:00", traffic: 1580 },
  { hour: "17:00", traffic: 1450 },
  { hour: "18:00", traffic: 1680 },
  { hour: "19:00", traffic: 1850 },
  { hour: "20:00", traffic: 1920 },
  { hour: "21:00", traffic: 1750 },
  { hour: "22:00", traffic: 1280 },
  { hour: "23:00", traffic: 780 },
];

const peakHour = data.reduce((max, item) => (item.traffic > max.traffic ? item : max), data[0]);
const lowHour = data.reduce((min, item) => (item.traffic < min.traffic ? item : min), data[0]);
const avgTraffic = Math.round(data.reduce((sum, item) => sum + item.traffic, 0) / data.length);

export function TrafficChart() {
  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-display font-semibold text-foreground">
            Traffic Management
          </h3>
          <p className="text-sm text-muted-foreground">
            User activity throughout the day
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Peak</p>
            <p className="font-semibold text-chart-green">{peakHour.hour}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Low</p>
            <p className="font-semibold text-chart-orange">{lowHour.hour}</p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Average</p>
            <p className="font-semibold text-primary">{avgTraffic}</p>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="hour"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              interval={2}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [`${value} users`, "Traffic"]}
            />
            <ReferenceLine
              y={avgTraffic}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              label={{ value: "Avg", position: "right", fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="traffic"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTraffic)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
