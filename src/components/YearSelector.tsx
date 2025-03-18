
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
  
  // Sort years in descending order
  useEffect(() => {
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
      <div className="flex flex-wrap gap-2">
        {yearItems.map(year => (
          <motion.div
            key={year}
            className={cn(
              "year-selector-item",
              selectedYears.includes(year) && "active"
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * (years.indexOf(year) % 5) }}
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
  );
}

export default YearSelector;
