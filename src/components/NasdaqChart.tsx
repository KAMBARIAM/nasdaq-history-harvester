
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { YearlyStockData } from '@/utils/stockData';
import { cn } from '@/lib/utils';
import { IntervalRange } from './YearSelector';

interface NasdaqChartProps {
  selectedData: YearlyStockData[];
  interval?: IntervalRange;
  className?: string;
  currency?: string;
}

const COLORS = [
  '#f97316', // Bright Orange
  '#0ea5e9', // Ocean Blue
  '#fbbf24', // Yellow
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#10b981', // Emerald
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#14b8a6', // Teal
];

export function NasdaqChart({ 
  selectedData, 
  interval = { start: 1, end: 12 }, 
  className, 
  currency = '$' 
}: NasdaqChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    if (!selectedData.length) return;
    
    const transformedData = processChartData(selectedData, interval);
    setChartData(transformedData);
  }, [selectedData, interval]);

  const processChartData = (yearlyData: YearlyStockData[], interval: IntervalRange) => {
    if (!yearlyData.length) return [];
    
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const filteredMonthIndices = Array.from(
      { length: interval.end - interval.start + 1 }, 
      (_, i) => i + interval.start - 1
    );
    
    // Use only the months within the selected interval
    return filteredMonthIndices.map((monthIndex) => {
      const month = monthLabels[monthIndex];
      const dataPoint: any = { month };
      
      yearlyData.forEach(yearData => {
        // Handle case where data might have actual dates
        if (yearData.data.length === 12) {
          // For simulated data with 12 months
          if (yearData.data[monthIndex]) {
            dataPoint[`y${yearData.year}`] = yearData.data[monthIndex].value;
            dataPoint[`${yearData.year}`] = `${currency}${yearData.data[monthIndex].value.toLocaleString()}`;
          }
        } else {
          // For actual data with dates, filter by month
          const monthData = yearData.data.find(d => {
            const date = new Date(d.date);
            return date.getMonth() === monthIndex;
          });
          
          if (monthData) {
            dataPoint[`y${yearData.year}`] = monthData.value;
            dataPoint[`${yearData.year}`] = `${currency}${monthData.value.toLocaleString()}`;
          }
        }
      });
      
      return dataPoint;
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel-strong p-4 shadow-lg">
          <p className="font-medium text-sm mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-mono">
                  {entry.name.substring(1)}: {currency}{entry.value.toLocaleString('en-US', {
                    maximumFractionDigits: 0
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      className={cn("chart-container glass-panel p-4", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            tickFormatter={(value) => `${currency}${value.toLocaleString()}`}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => value.substring(1)} 
            verticalAlign="top" 
            height={36}
          />
          {selectedData.map((yearData, index) => (
            <Line
              key={yearData.year}
              type="monotone"
              dataKey={`y${yearData.year}`}
              name={`y${yearData.year}`}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default NasdaqChart;
