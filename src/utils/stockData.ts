
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
  const years = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 
                 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 
                 2021, 2022, 2023, 2024];
  
  return years.map(year => {
    // Base values and trends based on historical NASDAQ-100 performance
    let baseValue, volatility, trend;
    
    // Simulate the dot-com bubble burst, financial crisis, and other major events
    if (year === 2001) {
      baseValue = 4000; // End of dot-com bubble
      volatility = 0.18;
      trend = -0.03; // Declining market
    } else if (year === 2002) {
      baseValue = 3000;
      volatility = 0.16;
      trend = -0.04; // Continued decline post bubble
    } else if (year === 2003) {
      baseValue = 2500;
      volatility = 0.13;
      trend = 0.02; // Beginning of recovery
    } else if (year >= 2004 && year <= 2007) {
      baseValue = 2800 + (year - 2004) * 500; // Steady growth period
      volatility = 0.09;
      trend = 0.015;
    } else if (year === 2008) {
      baseValue = 4500;
      volatility = 0.20; // Financial crisis volatility
      trend = -0.04; // Sharp decline
    } else if (year === 2009) {
      baseValue = 3000;
      volatility = 0.15;
      trend = 0.03; // Recovery begins
    } else if (year >= 2010 && year <= 2019) {
      // Post-financial crisis bull market
      baseValue = 4000 + (year - 2010) * 600;
      volatility = 0.08;
      trend = 0.02;
    } else if (year === 2020) {
      baseValue = 9000; // COVID crash and recovery
      volatility = 0.15;
      trend = 0.04;
    } else if (year === 2021) {
      baseValue = 12500;
      volatility = 0.08;
      trend = 0.03;
    } else if (year === 2022) {
      baseValue = 15000;
      volatility = 0.12;
      trend = -0.02; // Tech correction
    } else if (year === 2023) {
      baseValue = 14000;
      volatility = 0.09;
      trend = 0.025; // Recovery
    } else if (year === 2024) {
      baseValue = 17500;
      volatility = 0.08;
      trend = 0.015; // Current year
    } else {
      baseValue = 10000; // Fallback
      volatility = 0.08;
      trend = 0.01;
    }
    
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
