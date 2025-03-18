
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import YearSelector from './YearSelector';
import NasdaqChart from './NasdaqChart';
import StatCard from './StatCard';
import { YearlyStockData, getDataForYears } from '@/utils/stockData';

const availableYears = [2018, 2019, 2020, 2021, 2022, 2023, 2024];

export function CompareView() {
  const [selectedYears, setSelectedYears] = useState<number[]>([2022, 2023, 2024]);
  const [yearlyData, setYearlyData] = useState<YearlyStockData[]>([]);
  
  useEffect(() => {
    // Get data for selected years
    const data = getDataForYears(selectedYears);
    setYearlyData(data);
  }, [selectedYears]);

  const handleYearChange = (years: number[]) => {
    setSelectedYears(years);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-xl font-medium text-gray-800">NASDAQ-100 Historical Comparison</h2>
        <p className="text-gray-500 mt-1">Compare index performance across multiple years</p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <YearSelector 
            years={availableYears}
            selectedYears={selectedYears}
            onChange={handleYearChange}
            maxSelections={3}
          />
          
          {yearlyData.map((data, index) => (
            <motion.div
              key={data.year}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="mt-6 glass-panel p-5"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{data.year}</h3>
                <div 
                  className={`flex items-center ${
                    data.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {data.percentageChange >= 0 ? 
                    <ArrowUpRight size={16} /> : 
                    <ArrowDownRight size={16} />
                  }
                  <span className="font-medium ml-1">
                    {Math.abs(data.percentageChange)}%
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500">Start</div>
                  <div className="text-sm font-medium">${data.startPrice.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">End</div>
                  <div className="text-sm font-medium">${data.endPrice.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Low</div>
                  <div className="text-sm font-medium">${data.lowPrice.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">High</div>
                  <div className="text-sm font-medium">${data.highPrice.toLocaleString()}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="lg:col-span-2">
          <NasdaqChart selectedData={yearlyData} />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {yearlyData.length > 0 && (
              <>
                <StatCard 
                  title="Best Performer" 
                  value={yearlyData.reduce((best, current) => 
                    current.percentageChange > best.percentageChange ? current : best
                  ).year.toString()}
                  trend={yearlyData.reduce((best, current) => 
                    current.percentageChange > best.percentageChange ? current : best
                  ).percentageChange}
                  delay={0.1}
                />
                <StatCard 
                  title="Worst Performer" 
                  value={yearlyData.reduce((worst, current) => 
                    current.percentageChange < worst.percentageChange ? current : worst
                  ).year.toString()}
                  trend={yearlyData.reduce((worst, current) => 
                    current.percentageChange < worst.percentageChange ? current : worst
                  ).percentageChange}
                  delay={0.2}
                />
                <StatCard 
                  title="Highest Value" 
                  value={Math.max(...yearlyData.map(d => d.highPrice))}
                  isPrice={true}
                  delay={0.3}
                />
                <StatCard 
                  title="Avg. Change" 
                  value={yearlyData.reduce((sum, current) => 
                    sum + current.percentageChange, 0) / yearlyData.length}
                  isPercentage={true}
                  delay={0.4}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompareView;
