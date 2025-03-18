
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 flex justify-between items-center",
        scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
      )}
    >
      <div className="flex items-center">
        <h1 className="text-lg font-medium tracking-tight text-nasdaq-700">
          NASDAQ<span className="font-light">Compare</span>
        </h1>
      </div>
      
      <nav className="hidden md:flex space-x-8">
        <a 
          href="#" 
          className="text-sm font-medium text-gray-700 transition-colors hover:text-nasdaq-600"
        >
          Dashboard
        </a>
        <a 
          href="#" 
          className="text-sm font-medium text-gray-700 transition-colors hover:text-nasdaq-600"
        >
          Historical Data
        </a>
        <a 
          href="#" 
          className="text-sm font-medium text-gray-700 transition-colors hover:text-nasdaq-600"
        >
          About
        </a>
      </nav>
      
      <div className="animate-fade-in">
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-nasdaq-500 to-nasdaq-300 flex items-center justify-center shadow-sm">
          <span className="text-white text-xs font-medium">N100</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
