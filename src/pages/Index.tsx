
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import CompareView from '@/components/CompareView';

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      <Header />
      
      <main className="pt-24 pb-16">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-nasdaq-100/20 filter blur-3xl" />
            <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-nasdaq-300/10 filter blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="relative inline-block">
                  <span className="relative z-10">NASDAQ-100</span>
                  <motion.span 
                    className="absolute bottom-2 left-0 w-full h-3 bg-nasdaq-200 -z-10" 
                    initial={{ width: 0 }}
                    animate={loaded ? { width: "100%" } : {}}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                  />
                </span>{" "}
                Historical Comparison
              </motion.h1>
              
              <motion.p 
                className="mt-6 text-lg text-gray-600"
                initial={{ opacity: 0 }}
                animate={loaded ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Explore and compare how the NASDAQ-100 index performed across different years with our interactive visualization tool.
              </motion.p>
            </motion.div>
            
            <CompareView />
          </div>
        </section>
      </main>
      
      <footer className="py-8 px-4 text-center text-sm text-gray-500">
        <p>NASDAQ-100 Historical Comparison Tool | Data is simulated for demonstration purposes</p>
      </footer>
    </div>
  );
};

export default Index;
