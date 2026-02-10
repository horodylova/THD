import React from 'react';
import {
  LineChart,
  // Line, // will be used later
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DataChartProps {
  // We can add props here later when we connect real data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[]; 
}

export default function DataChart({ data = [] }: DataChartProps) {
  // Generate years from 2007 to 2024 for the X-axis domain if no data
  // or just to ensure the axis range is correct.
  // The user asked for "years" on horizontal axis.
  
  // Mock data structure for now (empty as requested, but we need structure for the axis)
  // Or purely empty? "пока что пустой!"
  // If I pass empty array to Recharts, it renders axes but no lines.
  
  return (
    <div className="w-full h-full p-4">
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="year" 
              type="category"
              allowDuplicatedCategory={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              label={{ value: 'Year', position: 'insideBottom', offset: -5, fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              label={{ 
                value: 'Hundreds of People', 
                angle: -90, 
                position: 'insideLeft', 
                fill: '#9CA3AF',
                fontSize: 12,
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '8px', 
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            {/* 
              This is where we would define <Line /> components.
              Leaving it empty for now as requested.
            */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
