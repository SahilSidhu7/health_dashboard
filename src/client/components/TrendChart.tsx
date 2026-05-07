import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export function TrendChart({ data }: { data: any }) {
  if (!data || data.length === 0) return null;

  // Calculate the 7-day average for the reference line based on the last 7 days
  const last7Days = data.slice(-7);
  const sum = last7Days.reduce((acc: number, val: any) => acc + val.reportCount, 0);
  const avg7d = sum / (last7Days.length || 1);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
          <p style={{ margin: 0 }}>Reports: {dataPoint.reportCount}</p>
          {dataPoint.isSpike && <p style={{ margin: 0, color: 'var(--color-red)', fontWeight: 'bold' }}>⚠ Spike</p>}
        </div>
      );
    }
    return null;
  };

  const CustomizedDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.isSpike) {
      return <circle cx={cx} cy={cy} r={5} stroke="var(--bg-primary)" strokeWidth={2} fill="var(--color-red)" />;
    }
    return <circle cx={cx} cy={cy} r={3} stroke="var(--bg-primary)" strokeWidth={1} fill="var(--color-blue)" />;
  };

  return (
    <div className="card" style={{ height: '350px' }}>
      <h2 className="card-title">Report Trends (30 Days)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: 'var(--border-color)' }}
            minTickGap={20}
          />
          <YAxis 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: 'var(--border-color)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={avg7d} stroke="var(--text-muted)" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="reportCount" 
            stroke="var(--color-blue)" 
            strokeWidth={2} 
            dot={<CustomizedDot />}
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
