
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface YearSelectorProps {
  years: number[];
  selectedYears: number[];
  maxSelections?: number;
  onChange: (selectedYears: number[]) => void;
}

export function YearSelector({
  years,
  selectedYears,
  maxSelections = 3,
  onChange
}: YearSelectorProps) {
  const [yearItems, setYearItems] = useState<number[]>(years);
  const [yearGroups, setYearGroups] = useState<{decade: string, years: number[]}[]>([]);
  
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
    </div>
  );
}

export default YearSelector;
