
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import YearSelector from './YearSelector';
import NasdaqChart from './NasdaqChart';
import StatCard from './StatCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { YearlyStockData, getDataForYears, getDowJonesData, getNifty50Data, getGoldData } from '@/utils/stockData';

const availableYears = [
  2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
  2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
  2021, 2022, 2023, 2024
];

export function CompareView() {
  const [selectedYears, setSelectedYears] = useState<number[]>([2008, 2020, 2024]);
  const [nasdaqData, setNasdaqData] = useState<YearlyStockData[]>([]);
  const [dowJonesData, setDowJonesData] = useState<YearlyStockData[]>([]);
  const [nifty50Data, setNifty50Data] = useState<YearlyStockData[]>([]);
  const [goldData, setGoldData] = useState<YearlyStockData[]>([]);
  const [activeTab, setActiveTab] = useState("nasdaq");
  
  useEffect(() => {
    // Get data for selected years
    const nasdaqYearlyData = getDataForYears(selectedYears);
    const dowJonesYearlyData = getDowJonesData(selectedYears);
    const nifty50YearlyData = getNifty50Data(selectedYears);
    const goldYearlyData = getGoldData(selectedYears);
    
    setNasdaqData(nasdaqYearlyData);
    setDowJonesData(dowJonesYearlyData);
    setNifty50Data(nifty50YearlyData);
    setGoldData(goldYearlyData);
  }, [selectedYears]);

  const handleYearChange = (years: number[]) => {
    setSelectedYears(years);
  };

  const getActiveData = () => {
    switch(activeTab) {
      case "nasdaq": return nasdaqData;
      case "dowjones": return dowJonesData;
      case "nifty50": return nifty50Data;
      case "gold": return goldData;
      default: return nasdaqData;
    }
  };

  const getTabTitle = () => {
    switch(activeTab) {
      case "nasdaq": return "NASDAQ-100";
      case "dowjones": return "Dow Jones";
      case "nifty50": return "Nifty 50";
      case "gold": return "Gold";
      default: return "NASDAQ-100";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-xl font-medium text-gray-800">Historical Market Comparison</h2>
        <p className="text-gray-500 mt-1">Compare performance across multiple years (2001-present)</p>
      </motion.div>
      
      <Tabs 
        defaultValue="nasdaq" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="nasdaq">NASDAQ-100</TabsTrigger>
          <TabsTrigger value="dowjones">Dow Jones</TabsTrigger>
          <TabsTrigger value="nifty50">Nifty 50</TabsTrigger>
          <TabsTrigger value="gold">Gold</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nasdaq" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <YearSelector 
                years={availableYears}
                selectedYears={selectedYears}
                onChange={handleYearChange}
                maxSelections={3}
              />
              
              {nasdaqData.map((data, index) => (
                <motion.div
                  key={data.year}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="glass-panel p-5"
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
              <NasdaqChart selectedData={nasdaqData} />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {nasdaqData.length > 0 && (
                  <>
                    <StatCard 
                      title="Best Performer" 
                      value={nasdaqData.reduce((best, current) => 
                        current.percentageChange > best.percentageChange ? current : best
                      ).year.toString()}
                      trend={nasdaqData.reduce((best, current) => 
                        current.percentageChange > best.percentageChange ? current : best
                      ).percentageChange}
                      delay={0.1}
                    />
                    <StatCard 
                      title="Worst Performer" 
                      value={nasdaqData.reduce((worst, current) => 
                        current.percentageChange < worst.percentageChange ? current : worst
                      ).year.toString()}
                      trend={nasdaqData.reduce((worst, current) => 
                        current.percentageChange < worst.percentageChange ? current : worst
                      ).percentageChange}
                      delay={0.2}
                    />
                    <StatCard 
                      title="Highest Value" 
                      value={Math.max(...nasdaqData.map(d => d.highPrice))}
                      isPrice={true}
                      delay={0.3}
                    />
                    <StatCard 
                      title="Avg. Change" 
                      value={nasdaqData.reduce((sum, current) => 
                        sum + current.percentageChange, 0) / nasdaqData.length}
                      isPercentage={true}
                      delay={0.4}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="dowjones" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <YearSelector 
                years={availableYears}
                selectedYears={selectedYears}
                onChange={handleYearChange}
                maxSelections={3}
              />
              
              {dowJonesData.map((data, index) => (
                <motion.div
                  key={data.year}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="glass-panel p-5"
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
              <NasdaqChart selectedData={dowJonesData} />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {dowJonesData.length > 0 && (
                  <>
                    <StatCard 
                      title="Best Performer" 
                      value={dowJonesData.reduce((best, current) => 
                        current.percentageChange > best.percentageChange ? current : best
                      ).year.toString()}
                      trend={dowJonesData.reduce((best, current) => 
                        current.percentageChange > best.percentageChange ? current : best
                      ).percentageChange}
                      delay={0.1}
                    />
                    <StatCard 
                      title="Worst Performer" 
                      value={dowJonesData.reduce((worst, current) => 
                        current.percentageChange < worst.percentageChange ? current : worst
                      ).year.toString()}
                      trend={dowJonesData.reduce((worst, current) => 
                        current.percentageChange < worst.percentageChange ? current : worst
                      ).percentageChange}
                      delay={0.2}
                    />
                    <StatCard 
                      title="Highest Value" 
                      value={Math.max(...dowJonesData.map(d => d.highPrice))}
                      isPrice={true}
                      delay={0.3}
                    />
                    <StatCard 
                      title="Avg. Change" 
                      value={dowJonesData.reduce((sum, current) => 
                        sum + current.percentageChange, 0) / dowJonesData.length}
                      isPercentage={true}
                      delay={0.4}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="nifty50" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <YearSelector 
                years={availableYears}
                selectedYears={selectedYears}
                onChange={handleYearChange}
                maxSelections={3}
              />
              
              {nifty50Data.map((data, index) => (
                <motion.div
                  key={data.year}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="glass-panel p-5"
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
                      <div className="text-sm font-medium">₹{data.startPrice.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">End</div>
                      <div className="text-sm font-medium">₹{data.endPrice.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Low</div>
                      <div className="text-sm font-medium">₹{data.lowPrice.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">High</div>
                      <div className="text-sm font-medium">₹{data.highPrice.toLocaleString()}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="lg:col-span-2">
              <NasdaqChart selectedData={nifty50Data} currency="₹" />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {nifty50Data.length > 0 && (
                  <>
                    <StatCard 
                      title="Best Performer" 
                      value={nifty50Data.reduce((best, current) => 
                        current.percentageChange > best.percentageChange ? current : best
                      ).year.toString()}
                      trend={nifty50Data.reduce((best, current) => 
                        current.percentageChange > best.percentageChange ? current : best
                      ).percentageChange}
                      delay={0.1}
                    />
                    <StatCard 
                      title="Worst Performer" 
                      value={nifty50Data.reduce((worst, current) => 
                        current.percentageChange < worst.percentageChange ? current : worst
                      ).year.toString()}
                      trend={nifty50Data.reduce((worst, current) => 
                        current.percentageChange < worst.percentageChange ? current : worst
                      ).percentageChange}
                      delay={0.2}
                    />
                    <StatCard 
                      title="Highest Value" 
                      value={Math.max(...nifty50Data.map(d => d.highPrice))}
                      isPrice={true}
                      currencySymbol="₹"
                      delay={0.3}
                    />
                    <StatCard 
                      title="Avg. Change" 
                      value={nifty50Data.reduce((sum, current) => 
                        sum + current.percentageChange, 0) / nifty50Data.length}
                      isPercentage={true}
                      delay={0.4}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="gold" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <YearSelector 
                years={availableYears}
                selectedYears={selectedYears}
                onChange={handleYearChange}
                maxSelections={3}
              />
              
              {goldData.map((data, index) => (
                <motion.div
                  key={data.year}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="glass-panel p-5"
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
              <NasdaqChart selectedData={goldData} />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {goldData.length > 0 && (
                  <>
                    <StatCard 
                      title="Best Performer" 
                      value={goldData.reduce((best, current) => 
                        current.percentageChange > best.percentageChange ? current : best
                      ).year.toString()}
                      trend={goldData.reduce((best, current) => 
                        current.percentageChange > best.percentageChange ? current : best
                      ).percentageChange}
                      delay={0.1}
                    />
                    <StatCard 
                      title="Worst Performer" 
                      value={goldData.reduce((worst, current) => 
                        current.percentageChange < worst.percentageChange ? current : worst
                      ).year.toString()}
                      trend={goldData.reduce((worst, current) => 
                        current.percentageChange < worst.percentageChange ? current : worst
                      ).percentageChange}
                      delay={0.2}
                    />
                    <StatCard 
                      title="Highest Value" 
                      value={Math.max(...goldData.map(d => d.highPrice))}
                      isPrice={true}
                      delay={0.3}
                    />
                    <StatCard 
                      title="Avg. Change" 
                      value={goldData.reduce((sum, current) => 
                        sum + current.percentageChange, 0) / goldData.length}
                      isPercentage={true}
                      delay={0.4}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CompareView;
