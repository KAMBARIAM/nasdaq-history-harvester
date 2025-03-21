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
    let baseValue, volatility, trend;
    
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
    
    const data: StockDataPoint[] = [];
    let currentValue = baseValue * (0.95 + Math.random() * 0.1); // Start with slight random variation
    const startPrice = currentValue;
    let highPrice = currentValue;
    let lowPrice = currentValue;
    
    for (let month = 0; month < 12; month++) {
      currentValue = currentValue * (1 + trend + (Math.random() * 2 - 1) * volatility);
      
      if (currentValue > highPrice) highPrice = currentValue;
      if (currentValue < lowPrice) lowPrice = currentValue;
      
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

// Generate Dow Jones data
export const generateDowJonesData = (): YearlyStockData[] => {
  const years = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 
                 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 
                 2021, 2022, 2023, 2024];
  
  return years.map(year => {
    let baseValue, volatility, trend;
    
    if (year === 2001) {
      baseValue = 10000; 
      volatility = 0.12;
      trend = -0.02; 
    } else if (year === 2002) {
      baseValue = 9800;
      volatility = 0.14;
      trend = -0.03; 
    } else if (year === 2003) {
      baseValue = 9500;
      volatility = 0.11;
      trend = 0.02; 
    } else if (year >= 2004 && year <= 2007) {
      baseValue = 10000 + (year - 2004) * 800; 
      volatility = 0.08;
      trend = 0.013;
    } else if (year === 2008) {
      baseValue = 13000;
      volatility = 0.18; 
      trend = -0.035;
    } else if (year === 2009) {
      baseValue = 8500;
      volatility = 0.14;
      trend = 0.025; 
    } else if (year >= 2010 && year <= 2019) {
      baseValue = 10500 + (year - 2010) * 1200;
      volatility = 0.07;
      trend = 0.015;
    } else if (year === 2020) {
      baseValue = 28000; 
      volatility = 0.14;
      trend = 0.035;
    } else if (year === 2021) {
      baseValue = 30000;
      volatility = 0.07;
      trend = 0.025;
    } else if (year === 2022) {
      baseValue = 35000;
      volatility = 0.10;
      trend = -0.015; 
    } else if (year === 2023) {
      baseValue = 33000;
      volatility = 0.08;
      trend = 0.02; 
    } else if (year === 2024) {
      baseValue = 37000;
      volatility = 0.07;
      trend = 0.01; 
    } else {
      baseValue = 20000; 
      volatility = 0.07;
      trend = 0.01;
    }
    
    const data: StockDataPoint[] = [];
    let currentValue = baseValue * (0.95 + Math.random() * 0.1); 
    const startPrice = currentValue;
    let highPrice = currentValue;
    let lowPrice = currentValue;
    
    for (let month = 0; month < 12; month++) {
      currentValue = currentValue * (1 + trend + (Math.random() * 2 - 1) * volatility);
      
      if (currentValue > highPrice) highPrice = currentValue;
      if (currentValue < lowPrice) lowPrice = currentValue;
      
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

// Generate Nifty 50 data
export const generateNifty50Data = (): YearlyStockData[] => {
  const years = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 
                 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 
                 2021, 2022, 2023, 2024];
  
  return years.map(year => {
    let baseValue, volatility, trend;
    
    if (year === 2001) {
      baseValue = 1200; 
      volatility = 0.14;
      trend = -0.025; 
    } else if (year === 2002) {
      baseValue = 1100;
      volatility = 0.15;
      trend = -0.02; 
    } else if (year === 2003) {
      baseValue = 1050;
      volatility = 0.13;
      trend = 0.03; 
    } else if (year >= 2004 && year <= 2007) {
      baseValue = 1200 + (year - 2004) * 400; 
      volatility = 0.12;
      trend = 0.025;
    } else if (year === 2008) {
      baseValue = 5000;
      volatility = 0.22; 
      trend = -0.05;
    } else if (year === 2009) {
      baseValue = 3000;
      volatility = 0.16;
      trend = 0.04; 
    } else if (year >= 2010 && year <= 2019) {
      baseValue = 5000 + (year - 2010) * 700;
      volatility = 0.11;
      trend = 0.018;
    } else if (year === 2020) {
      baseValue = 12000; 
      volatility = 0.17;
      trend = 0.04;
    } else if (year === 2021) {
      baseValue = 14000;
      volatility = 0.09;
      trend = 0.035;
    } else if (year === 2022) {
      baseValue = 17000;
      volatility = 0.12;
      trend = -0.01; 
    } else if (year === 2023) {
      baseValue = 17500;
      volatility = 0.10;
      trend = 0.03; 
    } else if (year === 2024) {
      baseValue = 21000;
      volatility = 0.08;
      trend = 0.015; 
    } else {
      baseValue = 8000; 
      volatility = 0.10;
      trend = 0.015;
    }
    
    const data: StockDataPoint[] = [];
    let currentValue = baseValue * (0.95 + Math.random() * 0.1); 
    const startPrice = currentValue;
    let highPrice = currentValue;
    let lowPrice = currentValue;
    
    for (let month = 0; month < 12; month++) {
      currentValue = currentValue * (1 + trend + (Math.random() * 2 - 1) * volatility);
      
      if (currentValue > highPrice) highPrice = currentValue;
      if (currentValue < lowPrice) lowPrice = currentValue;
      
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

// Generate Gold price data
export const generateGoldData = (): YearlyStockData[] => {
  const years = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 
                 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 
                 2021, 2022, 2023, 2024];
  
  return years.map(year => {
    let baseValue, volatility, trend;
    
    if (year === 2001) {
      baseValue = 280; 
      volatility = 0.08;
      trend = 0.01; 
    } else if (year === 2002) {
      baseValue = 310;
      volatility = 0.08;
      trend = 0.015; 
    } else if (year === 2003) {
      baseValue = 360;
      volatility = 0.09;
      trend = 0.02; 
    } else if (year >= 2004 && year <= 2007) {
      baseValue = 400 + (year - 2004) * 100; 
      volatility = 0.09;
      trend = 0.02;
    } else if (year === 2008) {
      baseValue = 850;
      volatility = 0.15; 
      trend = 0.025;
    } else if (year === 2009) {
      baseValue = 880;
      volatility = 0.12;
      trend = 0.03; 
    } else if (year === 2010) {
      baseValue = 1100;
      volatility = 0.10;
      trend = 0.025;
    } else if (year === 2011) {
      baseValue = 1400;
      volatility = 0.12;
      trend = 0.03;
    } else if (year === 2012) {
      baseValue = 1650;
      volatility = 0.09;
      trend = 0.01;
    } else if (year >= 2013 && year <= 2015) {
      baseValue = 1700 - (year - 2013) * 150;
      volatility = 0.10;
      trend = -0.01;
    } else if (year >= 2016 && year <= 2019) {
      baseValue = 1100 + (year - 2016) * 100;
      volatility = 0.08;
      trend = 0.015;
    } else if (year === 2020) {
      baseValue = 1520; 
      volatility = 0.11;
      trend = 0.03;
    } else if (year === 2021) {
      baseValue = 1950;
      volatility = 0.09;
      trend = -0.005;
    } else if (year === 2022) {
      baseValue = 1800;
      volatility = 0.10;
      trend = 0.005; 
    } else if (year === 2023) {
      baseValue = 1830;
      volatility = 0.09;
      trend = 0.015; 
    } else if (year === 2024) {
      baseValue = 2050;
      volatility = 0.08;
      trend = 0.02; 
    } else {
      baseValue = 1000; 
      volatility = 0.09;
      trend = 0.01;
    }
    
    const data: StockDataPoint[] = [];
    let currentValue = baseValue * (0.97 + Math.random() * 0.06); 
    const startPrice = currentValue;
    let highPrice = currentValue;
    let lowPrice = currentValue;
    
    for (let month = 0; month < 12; month++) {
      currentValue = currentValue * (1 + trend + (Math.random() * 2 - 1) * volatility);
      
      if (currentValue > highPrice) highPrice = currentValue;
      if (currentValue < lowPrice) lowPrice = currentValue;
      
      data.push({
        date: `${year}-${String(month + 1).padStart(2, '0')}-01`,
        value: Math.round(currentValue * 100) / 100
      });
    }
    
    const endPrice = currentValue;
    const percentageChange = ((endPrice - startPrice) / startPrice) * 100;
    
    return {
      year,
      data,
      startPrice: Math.round(startPrice * 100) / 100,
      endPrice: Math.round(endPrice * 100) / 100,
      highPrice: Math.round(highPrice * 100) / 100,
      lowPrice: Math.round(lowPrice * 100) / 100,
      percentageChange: parseFloat(percentageChange.toFixed(2))
    };
  });
};

// Generate Silver price data
export const generateSilverData = (): YearlyStockData[] => {
  const years = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 
                 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 
                 2021, 2022, 2023, 2024];
  
  return years.map(year => {
    let baseValue, volatility, trend;
    
    if (year === 2001) {
      baseValue = 4.5; 
      volatility = 0.09;
      trend = 0.01; 
    } else if (year === 2002) {
      baseValue = 4.6;
      volatility = 0.09;
      trend = 0.015; 
    } else if (year === 2003) {
      baseValue = 4.9;
      volatility = 0.10;
      trend = 0.02; 
    } else if (year >= 2004 && year <= 2007) {
      baseValue = 6.5 + (year - 2004) * 2; 
      volatility = 0.11;
      trend = 0.025;
    } else if (year === 2008) {
      baseValue = 15;
      volatility = 0.18; 
      trend = -0.03;
    } else if (year === 2009) {
      baseValue = 14;
      volatility = 0.15;
      trend = 0.04; 
    } else if (year === 2010) {
      baseValue = 18;
      volatility = 0.12;
      trend = 0.035;
    } else if (year === 2011) {
      baseValue = 30;
      volatility = 0.14;
      trend = 0.04;
    } else if (year === 2012) {
      baseValue = 33;
      volatility = 0.11;
      trend = -0.01;
    } else if (year >= 2013 && year <= 2015) {
      baseValue = 28 - (year - 2013) * 4;
      volatility = 0.12;
      trend = -0.015;
    } else if (year >= 2016 && year <= 2019) {
      baseValue = 16 + (year - 2016) * 1.5;
      volatility = 0.10;
      trend = 0.01;
    } else if (year === 2020) {
      baseValue = 18; 
      volatility = 0.14;
      trend = 0.05;
    } else if (year === 2021) {
      baseValue = 25;
      volatility = 0.13;
      trend = -0.008;
    } else if (year === 2022) {
      baseValue = 23;
      volatility = 0.11;
      trend = -0.01; 
    } else if (year === 2023) {
      baseValue = 22;
      volatility = 0.10;
      trend = 0.02; 
    } else if (year === 2024) {
      baseValue = 24;
      volatility = 0.09;
      trend = 0.03; 
    } else {
      baseValue = 20; 
      volatility = 0.10;
      trend = 0.01;
    }
    
    const data: StockDataPoint[] = [];
    let currentValue = baseValue * (0.97 + Math.random() * 0.06); 
    const startPrice = currentValue;
    let highPrice = currentValue;
    let lowPrice = currentValue;
    
    for (let month = 0; month < 12; month++) {
      currentValue = currentValue * (1 + trend + (Math.random() * 2 - 1) * volatility);
      
      if (currentValue > highPrice) highPrice = currentValue;
      if (currentValue < lowPrice) lowPrice = currentValue;
      
      data.push({
        date: `${year}-${String(month + 1).padStart(2, '0')}-01`,
        value: Math.round(currentValue * 100) / 100
      });
    }
    
    const endPrice = currentValue;
    const percentageChange = ((endPrice - startPrice) / startPrice) * 100;
    
    return {
      year,
      data,
      startPrice: Math.round(startPrice * 100) / 100,
      endPrice: Math.round(endPrice * 100) / 100,
      highPrice: Math.round(highPrice * 100) / 100,
      lowPrice: Math.round(lowPrice * 100) / 100,
      percentageChange: parseFloat(percentageChange.toFixed(2))
    };
  });
};

// Get data for specific years
export const getDataForYears = (years: number[]): YearlyStockData[] => {
  const allData = generateNasdaqData();
  return allData.filter(yearData => years.includes(yearData.year));
};

// Get Dow Jones data for specific years
export const getDowJonesData = (years: number[]): YearlyStockData[] => {
  const allData = generateDowJonesData();
  return allData.filter(yearData => years.includes(yearData.year));
};

// Get Nifty 50 data for specific years
export const getNifty50Data = (years: number[]): YearlyStockData[] => {
  const allData = generateNifty50Data();
  return allData.filter(yearData => years.includes(yearData.year));
};

// Get Gold data for specific years
export const getGoldData = (years: number[]): YearlyStockData[] => {
  const allData = generateGoldData();
  return allData.filter(yearData => years.includes(yearData.year));
};

// Get Silver data for specific years
export const getSilverData = (years: number[]): YearlyStockData[] => {
  const allData = generateSilverData();
  return allData.filter(yearData => years.includes(yearData.year));
};

// Format numbers with commas
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format percentage with + or - sign and exactly 2 decimal places
export const formatPercentage = (percentage: number): string => {
  const formattedValue = percentage.toFixed(2);
  return percentage > 0 ? `+${formattedValue}%` : `${formattedValue}%`;
};
