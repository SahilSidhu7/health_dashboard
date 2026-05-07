import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

export function WorkloadChart({ data }: { data: any }) {
  if (!data || data.length === 0) return null;

  // Custom colors for bars (teal to purple gradient effect)
  const colors = ['#0d9488', '#0f766e', '#115e59', '#3b0764', '#4c1d95', '#5b21b6', '#6d28d9', '#7c3aed'];

  return (
    <div className="card" style={{ height: '350px' }}>
      <h2 className="card-title">Moderator Workload (30 Days)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="modName" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-primary)', fontSize: 13, fontWeight: 500 }}
            width={80}
          />
          <Tooltip 
            cursor={{ fill: 'var(--bg-tertiary)' }}
            contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }} 
          />
          <Bar dataKey="actionCount" radius={[0, 4, 4, 0]} barSize={24}>
            {data.map((_: any, index: number) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length] || '#000'} />
            ))}
            <LabelList dataKey="actionCount" position="right" fill="var(--text-muted)" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
