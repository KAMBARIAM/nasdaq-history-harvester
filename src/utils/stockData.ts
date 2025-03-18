
interface StockDataPoint {
  date: string;
  value: number;
}

export interface YearlyStockData {
  year: number;
  data: StockDataPoint[];
  startPrice: number;
  endPrice: number;
  highPrice: number;
  lowPrice: number;
  percentageChange: number;
}

// Generate mock NASDAQ data for different years
export const generateNasdaqData = (): YearlyStockData[] => {
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
  
  return years.map(year => {
    // Base values vary by year to simulate different market conditions
    const baseValue = year === 2020 ? 9000 : 
                     year === 2021 ? 12500 : 
                     year === 2022 ? 15000 :
                     year === 2023 ? 14000 :
                     year === 2024 ? 17500 :
                     year < 2020 ? 7000 : 10000;
    
    // Volatility adjustments by year
    const volatility = year === 2020 ? 0.15 : // Higher volatility for 2020 (COVID)
                      year === 2022 ? 0.12 : // Higher for 2022 (market correction)
                      0.08; // Normal volatility
    
    // Trend adjustments by year
    const trend = year === 2018 ? -0.01 : // Slight downtrend
                 year === 2020 ? 0.04 : // Strong uptrend after initial COVID drop
                 year === 2021 ? 0.03 : // Continued growth
                 year === 2022 ? -0.02 : // Downtrend
                 year === 2023 ? 0.025 : // Recovery
                 year === 2024 ? 0.015 : // Current year
                 0.01; // Default slight uptrend
    
    // Generate daily data points
    const data: StockDataPoint[] = [];
    let currentValue = baseValue * (0.95 + Math.random() * 0.1); // Start with slight random variation
    const startPrice = currentValue;
    let highPrice = currentValue;
    let lowPrice = currentValue;
    
    // Generate data for each month (simplified to 12 points per year)
    for (let month = 0; month < 12; month++) {
      // Apply trend and random movement
      currentValue = currentValue * (1 + trend + (Math.random() * 2 - 1) * volatility);
      
      // Update high and low prices
      if (currentValue > highPrice) highPrice = currentValue;
      if (currentValue < lowPrice) lowPrice = currentValue;
      
      // Add data point
      data.push({
        date: `${year}-${String(month + 1).padStart(2, '0')}-01`,
        value: Math.round(currentValue)
      });
    }
    
    const endPrice = currentValue;
    const percentageChange = ((endPrice - startPrice) / startPrice) * 100;
    
    return {
      year,
      data,
      startPrice: Math.round(startPrice),
      endPrice: Math.round(endPrice),
      highPrice: Math.round(highPrice),
      lowPrice: Math.round(lowPrice),
      percentageChange: parseFloat(percentageChange.toFixed(2))
    };
  });
};

// Get data for specific years
export const getDataForYears = (years: number[]): YearlyStockData[] => {
  const allData = generateNasdaqData();
  return allData.filter(yearData => years.includes(yearData.year));
};

// Format numbers with commas
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format percentage with + or - sign
export const formatPercentage = (percentage: number): string => {
  return percentage > 0 ? `+${percentage}%` : `${percentage}%`;
};
