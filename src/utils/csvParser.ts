
/**
 * Utility functions for parsing CSV stock data
 */
import { YearlyStockData } from './stockData';

// Define StockDataPoint interface if not exported from stockData
interface StockDataPoint {
  date: string;
  value: number;
}

// Parse CSV string to arrays of data
export const parseCSV = (csv: string): string[][] => {
  const lines = csv.split('\n');
  return lines.map(line => line.split(',').map(item => item.trim()));
};

// Convert CSV data to YearlyStockData format
export const convertCSVToStockData = (csvData: string[][], dateIndex: number = 0, valueIndex: number = 1): YearlyStockData[] => {
  // Skip header row if it exists
  const dataRows = csvData[0][0].toLowerCase().includes('date') ? csvData.slice(1) : csvData;
  
  // Group data by year
  const yearlyData: { [key: number]: StockDataPoint[] } = {};
  
  dataRows.forEach(row => {
    if (row.length <= Math.max(dateIndex, valueIndex)) return;
    
    const dateStr = row[dateIndex];
    const valueStr = row[valueIndex];
    
    // Parse date and value
    const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!dateMatch) return;
    
    const year = parseInt(dateMatch[1]);
    const value = parseFloat(valueStr);
    
    if (isNaN(year) || isNaN(value)) return;
    
    if (!yearlyData[year]) {
      yearlyData[year] = [];
    }
    
    yearlyData[year].push({
      date: dateStr,
      value
    });
  });
  
  // Convert to YearlyStockData format
  return Object.keys(yearlyData).map(yearStr => {
    const year = parseInt(yearStr);
    const data = yearlyData[year].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Calculate statistics
    const startPrice = data[0]?.value || 0;
    const endPrice = data[data.length - 1]?.value || 0;
    const highPrice = Math.max(...data.map(d => d.value));
    const lowPrice = Math.min(...data.map(d => d.value));
    const percentageChange = ((endPrice - startPrice) / startPrice) * 100;
    
    return {
      year,
      data,
      startPrice,
      endPrice,
      highPrice,
      lowPrice,
      percentageChange: parseFloat(percentageChange.toFixed(2))
    };
  }).sort((a, b) => a.year - b.year);
};

// Load CSV from a URL
export const loadCSVFromURL = async (url: string): Promise<string[][]> => {
  try {
    const response = await fetch(url);
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading CSV from URL:', error);
    return [];
  }
};

// Example CSV URLs for different indices
export const CSV_URLS = {
  nasdaq: '/data/nasdaq.csv',
  dowjones: '/data/dowjones.csv', 
  nifty50: '/data/nifty50.csv',
  gold: '/data/gold.csv'
};

// Example data loader to replace the simulated data
export const loadStockDataFromCSV = async (indexType: string = 'nasdaq'): Promise<YearlyStockData[]> => {
  try {
    const url = CSV_URLS[indexType as keyof typeof CSV_URLS];
    const csvData = await loadCSVFromURL(url);
    return convertCSVToStockData(csvData);
  } catch (error) {
    console.error(`Error loading ${indexType} data from CSV:`, error);
    // Fallback to simulated data
    const { generateNasdaqData, generateDowJonesData, generateNifty50Data, generateGoldData } = await import('./stockData');
    
    switch (indexType) {
      case 'nasdaq': return generateNasdaqData();
      case 'dowjones': return generateDowJonesData();
      case 'nifty50': return generateNifty50Data();
      case 'gold': return generateGoldData();
      default: return generateNasdaqData();
    }
  }
};
