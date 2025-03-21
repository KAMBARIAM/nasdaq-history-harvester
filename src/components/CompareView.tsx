
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Upload } from 'lucide-react';
import YearSelector, { IntervalRange } from './YearSelector';
import NasdaqChart from './NasdaqChart';
import StatCard from './StatCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { YearlyStockData, getDataForYears, getDowJonesData, getNifty50Data, getGoldData } from '@/utils/stockData';
import { loadStockDataFromCSV, parseCSV, convertCSVToStockData, NIFTY_INDICES } from '@/utils/csvParser';

const availableYears = [
  2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
  2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020,
  2021, 2022, 2023, 2024
];

export function CompareView() {
  const [selectedYears, setSelectedYears] = useState<number[]>([2008, 2020, 2022, 2023, 2024]);
  const [nasdaqData, setNasdaqData] = useState<YearlyStockData[]>([]);
  const [dowJonesData, setDowJonesData] = useState<YearlyStockData[]>([]);
  const [nifty50Data, setNifty50Data] = useState<YearlyStockData[]>([]);
  const [goldData, setGoldData] = useState<YearlyStockData[]>([]);
  const [activeTab, setActiveTab] = useState("nasdaq");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [interval, setInterval] = useState<IntervalRange>({ start: 1, end: 12 });
  const [dataSource, setDataSource] = useState<'simulated' | 'csv'>('simulated');
  const [selectedNiftyIndex, setSelectedNiftyIndex] = useState<string>('nifty50');
  
  useEffect(() => {
    // Load data based on the chosen source
    const loadData = async () => {
      setIsLoadingData(true);
      
      try {
        if (dataSource === 'csv') {
          // Load from CSV files
          const nasdaqResult = await loadStockDataFromCSV('nasdaq');
          const dowJonesResult = await loadStockDataFromCSV('dowjones');
          const niftyResult = await loadStockDataFromCSV(selectedNiftyIndex);
          const goldResult = await loadStockDataFromCSV('gold');
          
          setNasdaqData(filterDataForYears(nasdaqResult, selectedYears));
          setDowJonesData(filterDataForYears(dowJonesResult, selectedYears));
          setNifty50Data(filterDataForYears(niftyResult, selectedYears));
          setGoldData(filterDataForYears(goldResult, selectedYears));
          
          toast.success('CSV data loaded successfully');
        } else {
          // Use simulated data
          const nasdaqYearlyData = getDataForYears(selectedYears);
          const dowJonesYearlyData = getDowJonesData(selectedYears);
          const nifty50YearlyData = getNifty50Data(selectedYears);
          const goldYearlyData = getGoldData(selectedYears);
          
          setNasdaqData(nasdaqYearlyData);
          setDowJonesData(dowJonesYearlyData);
          setNifty50Data(nifty50YearlyData);
          setGoldData(goldYearlyData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error('Failed to load data. Using simulated data instead.');
        
        // Fallback to simulated data
        const nasdaqYearlyData = getDataForYears(selectedYears);
        const dowJonesYearlyData = getDowJonesData(selectedYears);
        const nifty50YearlyData = getNifty50Data(selectedYears);
        const goldYearlyData = getGoldData(selectedYears);
        
        setNasdaqData(nasdaqYearlyData);
        setDowJonesData(dowJonesYearlyData);
        setNifty50Data(nifty50YearlyData);
        setGoldData(goldYearlyData);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    loadData();
  }, [selectedYears, dataSource, selectedNiftyIndex]);

  const filterDataForYears = (data: YearlyStockData[], years: number[]): YearlyStockData[] => {
    return data.filter(yearData => years.includes(yearData.year));
  };

  const handleYearChange = (years: number[]) => {
    setSelectedYears(years);
  };

  const handleIntervalChange = (newInterval: IntervalRange) => {
    setInterval(newInterval);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const csvData = parseCSV(text);
      const stockData = convertCSVToStockData(csvData);
      
      // Update the specific index with the uploaded data
      switch (index) {
        case 'nasdaq':
          setNasdaqData(filterDataForYears(stockData, selectedYears));
          break;
        case 'dowjones':
          setDowJonesData(filterDataForYears(stockData, selectedYears));
          break;
        case 'nifty50':
        case 'niftybank':
        case 'niftyit':
        case 'niftypharma':
        case 'niftyauto':
          setNifty50Data(filterDataForYears(stockData, selectedYears));
          setSelectedNiftyIndex(index);
          break;
        case 'gold':
          setGoldData(filterDataForYears(stockData, selectedYears));
          break;
      }
      
      toast.success(`${index.toUpperCase()} data loaded from CSV`);
      setDataSource('csv');
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Failed to parse CSV file. Please check the format.');
    }
  };

  const handleNiftyIndexChange = (value: string) => {
    setSelectedNiftyIndex(value);
    // If we're in CSV mode, we'll need to reload the data
    if (dataSource === 'csv') {
      loadStockDataFromCSV(value).then(data => {
        setNifty50Data(filterDataForYears(data, selectedYears));
        toast.success(`${NIFTY_INDICES[value as keyof typeof NIFTY_INDICES]} data loaded`);
      });
    }
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
    if (activeTab === 'nifty50') {
      return NIFTY_INDICES[selectedNiftyIndex as keyof typeof NIFTY_INDICES];
    }
    
    switch(activeTab) {
      case "nasdaq": return "NASDAQ-100";
      case "dowjones": return "Dow Jones";
      case "gold": return "Gold";
      default: return "NASDAQ-100";
    }
  };

  const getCurrencySymbol = () => {
    return activeTab === 'nifty50' ? '₹' : '$';
  };

  const getNiftyFileUploadId = () => {
    return `csv-upload-${selectedNiftyIndex}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-gray-800">Historical Market Comparison</h2>
            <p className="text-gray-500 mt-1">Compare performance across multiple years (2001-present)</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <label className="inline-flex items-center">
              <span className="mr-2 text-sm text-gray-600">Data source:</span>
              <select 
                className="form-select text-sm rounded border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value as 'simulated' | 'csv')}
              >
                <option value="simulated">Simulated</option>
                <option value="csv">CSV files</option>
              </select>
            </label>
          </div>
        </div>
      </motion.div>
      
      <Tabs 
        defaultValue="nasdaq" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="nasdaq">NASDAQ-100</TabsTrigger>
          <TabsTrigger value="dowjones">Dow Jones</TabsTrigger>
          <TabsTrigger value="nifty50">Nifty Indices</TabsTrigger>
          <TabsTrigger value="gold">Gold</TabsTrigger>
        </TabsList>
        
        {['nasdaq', 'dowjones', 'nifty50', 'gold'].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                {/* Nifty Index Selector - Only show for Nifty tab */}
                {tabValue === 'nifty50' && (
                  <div className="glass-panel p-4">
                    <h3 className="text-sm text-gray-500 font-medium mb-3">Select Nifty Index</h3>
                    <Select 
                      value={selectedNiftyIndex} 
                      onValueChange={handleNiftyIndexChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Nifty index" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(NIFTY_INDICES).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              
                <YearSelector 
                  years={availableYears}
                  selectedYears={selectedYears}
                  onChange={handleYearChange}
                  maxSelections={5}
                  interval={interval}
                  onIntervalChange={handleIntervalChange}
                />
                
                {/* CSV Upload Button */}
                {dataSource === 'csv' && (
                  <div className="glass-panel p-4">
                    <h3 className="text-sm text-gray-500 font-medium mb-3">Upload CSV Data</h3>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        id={tabValue === 'nifty50' ? getNiftyFileUploadId() : `csv-upload-${tabValue}`}
                        onChange={(e) => handleFileUpload(e, tabValue === 'nifty50' ? selectedNiftyIndex : tabValue)}
                      />
                      <label 
                        htmlFor={tabValue === 'nifty50' ? getNiftyFileUploadId() : `csv-upload-${tabValue}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer text-sm"
                      >
                        <Upload size={16} />
                        Upload {getTabTitle()} CSV
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        Format: date,value (e.g., 2023-01-01,15000)
                      </p>
                    </div>
                  </div>
                )}
                
                {getActiveData().map((data, index) => (
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
                        <div className="text-sm font-medium">{getCurrencySymbol()}{data.startPrice.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">End</div>
                        <div className="text-sm font-medium">{getCurrencySymbol()}{data.endPrice.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Low</div>
                        <div className="text-sm font-medium">{getCurrencySymbol()}{data.lowPrice.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">High</div>
                        <div className="text-sm font-medium">{getCurrencySymbol()}{data.highPrice.toLocaleString()}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="lg:col-span-2">
                <NasdaqChart 
                  selectedData={getActiveData()} 
                  interval={interval}
                  currency={getCurrencySymbol()} 
                />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  {getActiveData().length > 0 && (
                    <>
                      <StatCard 
                        title="Best Performer" 
                        value={getActiveData().reduce((best, current) => 
                          current.percentageChange > best.percentageChange ? current : best
                        ).year.toString()}
                        trend={getActiveData().reduce((best, current) => 
                          current.percentageChange > best.percentageChange ? current : best
                        ).percentageChange}
                        delay={0.1}
                      />
                      <StatCard 
                        title="Worst Performer" 
                        value={getActiveData().reduce((worst, current) => 
                          current.percentageChange < worst.percentageChange ? current : worst
                        ).year.toString()}
                        trend={getActiveData().reduce((worst, current) => 
                          current.percentageChange < worst.percentageChange ? current : worst
                        ).percentageChange}
                        delay={0.2}
                      />
                      <StatCard 
                        title="Highest Value" 
                        value={Math.max(...getActiveData().map(d => d.highPrice))}
                        isPrice={true}
                        currencySymbol={getCurrencySymbol()}
                        delay={0.3}
                      />
                      <StatCard 
                        title="Avg. Change" 
                        value={getActiveData().reduce((sum, current) => 
                          sum + current.percentageChange, 0) / getActiveData().length}
                        isPercentage={true}
                        delay={0.4}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default CompareView;
