import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { DataItem } from '@/types';

interface DataChartProps {
  data: DataItem[];
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

export default function DataChart({ data = [] }: DataChartProps) {
  const [isLogScale, setIsLogScale] = useState(false);


  const chartData = useMemo(() => {
    const years = Array.from({ length: 2024 - 2007 + 1 }, (_, i) => 2007 + i);
    
    return years.map(year => {
      const yearStr = year.toString();
      const point: { [key: string]: number | null } = { year };
      
      data.forEach(item => {
       
        const val = item[yearStr];
    
        const numVal = typeof val === 'string' ? parseInt(val.replace(/,/g, ''), 10) : val;
        
        point[`item-${item.id}`] = !isNaN(numVal) ? numVal : null;
      });
      
      return point;
    });
  }, [data]);

  const colors = [
    '#4F46E5', 
    '#EC4899', 
    '#10B981', 
    '#F59E0B', 
    '#3B82F6', 
    '#8B5CF6', 
    '#EF4444', 
    '#6366F1', 
  ];

  return (
    <div className="w-full h-full p-4 relative flex flex-col">
      {/* Controls Header */}
      <div className="flex justify-between items-center mb-2 flex-none z-10">
        <h3 className="text-sm font-semibold text-gray-700">Trends</h3>
        <div className="flex items-center gap-2 chart-controls-no-export">
           <label className="flex items-center cursor-pointer relative">
            <input 
              type="checkbox"
              className="sr-only peer"
              checked={isLogScale}
              onChange={(e) => setIsLogScale(e.target.checked)}
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            <span className="ml-2 text-xs font-medium text-gray-600">Log Scale</span>
          </label>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="99%" height="100%" debounce={100}>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis 
              dataKey="year" 
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatNumber}
              width={40}
              scale={isLogScale ? 'log' : 'auto'}
              domain={data.length > 0 ? ['auto', 'auto'] : [0, 100]}
              allowDataOverflow
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '8px', 
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }}
              formatter={(value: number | undefined) => [
                typeof value === 'number' ? new Intl.NumberFormat('en-US').format(value) : 'N/A',
                'People'
              ]}
              labelStyle={{ color: '#6B7280', marginBottom: '0.25rem' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} 
              iconType="circle"
            />
            
            {data.map((item, index) => (
              <Line
                key={item.id}
                type="monotone"
                dataKey={`item-${item.id}`}
                name={`${item.cocNumber} - ${item.state}`} // Legend label
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 1 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                connectNulls
                isAnimationActive={true}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        {data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/80 px-4 py-2 rounded-full border border-gray-200 shadow-sm text-sm text-gray-500">
              Select rows in table to compare
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
