
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatNumber, formatPercentage } from '@/utils/stockData';

interface StatCardProps {
  title: string;
  value: number | string;
  trend?: number;
  isPercentage?: boolean;
  isPrice?: boolean;
  className?: string;
  delay?: number;
  currencySymbol?: string;
}

export function StatCard({
  title,
  value,
  trend,
  isPercentage = false,
  isPrice = false,
  className,
  delay = 0,
  currencySymbol = '$'
}: StatCardProps) {
  const formattedValue = typeof value === 'number' ? 
    (isPercentage ? formatPercentage(value) : 
     isPrice ? `${currencySymbol}${formatNumber(value)}` : formatNumber(value)) : 
    value;
  
  const trendColor = trend ? 
    (trend > 0 ? 'text-green-500' : 'text-red-500') : 
    '';

  return (
    <motion.div
      className={cn("glass-panel p-5", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="stat-label">{title}</div>
      <div className={cn("stat-value", trendColor)}>
        {formattedValue}
      </div>
      {trend !== undefined && (
        <div className={cn("text-xs font-medium mt-1", trendColor)}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(2)}%
        </div>
      )}
    </motion.div>
  );
}

export default StatCard;
