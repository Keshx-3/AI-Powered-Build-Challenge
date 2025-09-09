
'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface CryptoChartProps {
  data: { date: string; price: number }[];
  percentChange: number;
  simple?: boolean;
}

export function CryptoChart({ data, percentChange, simple = false }: CryptoChartProps) {
  const chartColor = percentChange >= 0 ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-1))';
  const gradientStopColor = percentChange >= 0 ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-1))';

  if (simple) {
    return (
       <ChartContainer
        config={{
          price: {
            label: 'Price',
            color: chartColor,
          },
        }}
        className="h-full w-full"
      >
        <AreaChart
            data={data}
            margin={{ top: 5, right: 0, left: 0, bottom: 0, }}
        >
             <defs>
                <linearGradient id="chart-gradient-simple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientStopColor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={gradientStopColor} stopOpacity={0}/>
                </linearGradient>
            </defs>
            <Area
                dataKey="price"
                type="natural"
                fill={'url(#chart-gradient-simple)'}
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
            />
        </AreaChart>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer
      config={{
        price: {
          label: 'Price',
          color: chartColor,
        },
      }}
      className="h-full w-full"
    >
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: 20,
          bottom: 0,
        }}
      >
        <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradientStopColor} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={gradientStopColor} stopOpacity={0}/>
            </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
             const date = new Date(value);
             return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          orientation="right"
          tickFormatter={(value) => `$${Number(value).toFixed(2)}`}
        />
        <ChartTooltip
          cursor={true}
          content={
            <ChartTooltipContent
              labelFormatter={(label, payload) => {
                 const date = new Date(payload[0]?.payload.date);
                 return date.toLocaleDateString("en-US", { dateStyle: 'medium'});
              }}
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="price"
          type="natural"
          fill={'url(#chart-gradient)'}
          stroke={chartColor}
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
