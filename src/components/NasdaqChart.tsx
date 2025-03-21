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
    
    const allDataPoints: { [date: string]: any } = {};
    
    yearlyData.forEach(yearData => {
      const filteredData = yearData.data.filter(dataPoint => {
        if (!dataPoint.date) return false;
        
        const date = new Date(dataPoint.date);
        const month = date.getMonth() + 1;
        return month >= interval.start && month <= interval.end;
      });
      
      filteredData.forEach(dataPoint => {
        const date = dataPoint.date.substring(5);
        if (!allDataPoints[date]) {
          allDataPoints[date] = { date };
        }
        
        allDataPoints[date][`y${yearData.year}`] = dataPoint.value;
        allDataPoints[date][`${yearData.year}`] = `${currency}${dataPoint.value.toLocaleString()}`;
      });
    });
    
    return Object.values(allDataPoints).sort((a, b) => {
      const [aMonth, aDay] = a.date.split('-').map(Number);
      const [bMonth, bDay] = b.date.split('-').map(Number);
      
      if (aMonth !== bMonth) return aMonth - bMonth;
      return aDay - bDay;
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

  const formatXAxis = (dateStr: string) => {
    if (!dateStr) return '';
    
    const dateParts = dateStr.split('-');
    if (dateParts.length === 2) {
      const month = parseInt(dateParts[0]);
      const day = parseInt(dateParts[1]);
      
      if (day === 1 || day === 15) {
        const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[month]} ${day}`;
      }
    }
    
    return '';
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
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
            tickFormatter={formatXAxis}
            interval={0}
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
              dot={false}
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
