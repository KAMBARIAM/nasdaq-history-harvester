
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

export interface IntervalRange {
  start: number; // 1-12 representing Jan-Dec
  end: number;   // 1-12 representing Jan-Dec
}

interface YearSelectorProps {
  years: number[];
  selectedYears: number[];
  maxSelections?: number;
  onChange: (selectedYears: number[]) => void;
  interval?: IntervalRange;
  onIntervalChange?: (interval: IntervalRange) => void;
}

export function YearSelector({
  years,
  selectedYears,
  maxSelections = 5,
  onChange,
  interval = { start: 1, end: 12 },
  onIntervalChange
}: YearSelectorProps) {
  const [yearItems, setYearItems] = useState<number[]>(years);
  const [yearGroups, setYearGroups] = useState<{decade: string, years: number[]}[]>([]);
  const [monthRange, setMonthRange] = useState<number[]>([interval.start, interval.end]);
  
  // Group years by decade and sort in descending order
  useEffect(() => {
    const groups: {[key: string]: number[]} = {};
    
    years.forEach(year => {
      const decade = `${Math.floor(year / 10) * 10}s`;
      if (!groups[decade]) {
        groups[decade] = [];
      }
      groups[decade].push(year);
    });
    
    // Sort years within each decade
    Object.keys(groups).forEach(decade => {
      groups[decade].sort((a, b) => b - a);
    });
    
    // Convert to array and sort decades
    const groupArray = Object.keys(groups).map(decade => ({
      decade,
      years: groups[decade]
    })).sort((a, b) => {
      // Extract the first year of the decade for comparison
      const decadeA = parseInt(a.decade);
      const decadeB = parseInt(b.decade);
      return decadeB - decadeA;
    });
    
    setYearGroups(groupArray);
    setYearItems([...years].sort((a, b) => b - a));
  }, [years]);

  const toggleYear = (year: number) => {
    if (selectedYears.includes(year)) {
      // Remove year if already selected
      onChange(selectedYears.filter(y => y !== year));
    } else if (selectedYears.length < maxSelections) {
      // Add year if under max selections
      onChange([...selectedYears, year]);
    }
  };

  const handleMonthRangeChange = (values: number[]) => {
    setMonthRange(values);
    if (onIntervalChange) {
      onIntervalChange({ start: values[0], end: values[1] });
    }
  };

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="glass-panel p-4 md:p-6">
      <h3 className="text-sm text-gray-500 font-medium mb-4">Select Years to Compare (max {maxSelections})</h3>
      <div className="space-y-4">
        {yearGroups.map((group, groupIndex) => (
          <div key={group.decade} className="space-y-2">
            <h4 className="text-xs font-medium text-gray-400">{group.decade}</h4>
            <div className="flex flex-wrap gap-2">
              {group.years.map((year, yearIndex) => (
                <motion.div
                  key={year}
                  className={cn(
                    "year-selector-item",
                    selectedYears.includes(year) && "active"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * yearIndex }}
                  onClick={() => toggleYear(year)}
                >
                  <span>{year}</span>
                  {selectedYears.includes(year) && (
                    <motion.span
                      className="ml-1 inline-block"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Month range slider */}
      {onIntervalChange && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h3 className="text-sm text-gray-500 font-medium mb-4">Select Month Range</h3>
          <div className="px-2 mb-2">
            <Slider 
              defaultValue={[interval.start, interval.end]} 
              value={monthRange}
              min={1} 
              max={12} 
              step={1} 
              onValueChange={handleMonthRangeChange}
              className="mb-6"
            />
            
            <div className="flex justify-between text-xs text-gray-500 mb-4">
              <span>{monthNames[monthRange[0] - 1]}</span>
              <span> to </span>
              <span>{monthNames[monthRange[1] - 1]}</span>
            </div>
            
            {/* Month range selector with direct inputs */}
            <div className="flex items-center justify-between gap-4">
              <div className="w-1/2">
                <label className="text-xs text-gray-500 block mb-1">Start Month</label>
                <select 
                  value={monthRange[0]} 
                  onChange={(e) => {
                    const start = parseInt(e.target.value);
                    const end = Math.max(monthRange[1], start);
                    const newRange = [start, end];
                    setMonthRange(newRange);
                    if (onIntervalChange) {
                      onIntervalChange({ start, end });
                    }
                  }}
                  className="w-full p-2 text-sm border border-gray-300 rounded bg-white"
                >
                  {monthNames.map((month, index) => (
                    <option key={`start-${index}`} value={index + 1} disabled={index + 1 > monthRange[1]}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="w-1/2">
                <label className="text-xs text-gray-500 block mb-1">End Month</label>
                <select 
                  value={monthRange[1]} 
                  onChange={(e) => {
                    const end = parseInt(e.target.value);
                    const start = Math.min(monthRange[0], end);
                    const newRange = [start, end];
                    setMonthRange(newRange);
                    if (onIntervalChange) {
                      onIntervalChange({ start, end });
                    }
                  }}
                  className="w-full p-2 text-sm border border-gray-300 rounded bg-white"
                >
                  {monthNames.map((month, index) => (
                    <option key={`end-${index}`} value={index + 1} disabled={index + 1 < monthRange[0]}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YearSelector;
