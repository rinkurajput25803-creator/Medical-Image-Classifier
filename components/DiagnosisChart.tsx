import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Diagnosis } from '../types';

interface DiagnosisChartProps {
  data: Diagnosis[];
}

export const DiagnosisChart: React.FC<DiagnosisChartProps> = ({ data }) => {
  const formattedData = data.map(d => ({
    name: d.condition,
    Probability: d.probability,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={formattedData}
        margin={{
          top: 5,
          right: 20,
          left: 10,
          bottom: 5,
        }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
        <XAxis type="number" domain={[0, 1]} tickFormatter={(tick) => `${Math.round(tick * 100)}%`} tick={{ fill: '#9CA3AF' }} />
        <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#9CA3AF' }} />
        <Tooltip
          formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Probability"]}
          contentStyle={{
            backgroundColor: '#1F2937',
            borderColor: '#4B5563',
          }}
          labelStyle={{ color: '#F3F4F6' }}
        />
        <Legend wrapperStyle={{ color: '#F3F4F6' }} />
        <Bar dataKey="Probability" fill="#8B5CF6" barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};