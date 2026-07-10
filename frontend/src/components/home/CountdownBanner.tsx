import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CountdownBanner = () => {
  // Set target date to a fixed point in the future to match the "2028-05-20" format in the original DOM
  const targetDate = new Date('2028-05-20T00:00:00');

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-[#ffebf4] py-12 lg:py-16">
      <div className="container-fluid mx-auto px-4 md:px-8 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row items-center">
          
          {/* Left Column - Text */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full lg:w-5/12 text-center lg:text-left mb-8 lg:mb-0"
          >
            <h3 className="font-serif text-3xl md:text-[32px] text-[#111111] mb-2 font-light">
              Seasonal Savings Event
            </h3>
            <div className="font-sans text-[#111111] text-[15px] font-light">
              Up to 30% Off on Must-Have Styles !
            </div>
          </motion.div>
          
          {/* Right Column - Timer & Button */}
          <div className="w-full lg:w-7/12 flex flex-col lg:flex-row items-center justify-between lg:justify-end gap-8 lg:gap-12 mt-2 lg:mt-0">
            
            {/* Timer Blocks */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center"
            >
              <ul className="flex items-center m-0 p-0 list-none">
                {Object.entries(timeLeft).map(([unit, value], index, array) => (
                  <li 
                    key={unit} 
                    className={`px-4 md:px-6 text-center leading-none ${index !== array.length - 1 ? 'border-r border-black/10' : ''}`}
                  >
                    <span className="block font-serif text-[32px] md:text-[40px] text-[#111111] mb-1 min-w-[50px] md:min-w-[64px] font-light">
                      {value.toString().padStart(2, '0')}
                    </span>
                    <span className="block font-sans text-[10px] md:text-xs tracking-[1.5px] md:tracking-[2px] uppercase text-[#111111] font-semibold">
                      {unit}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Button */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-2 lg:mt-0"
            >
              <Link 
                to="/shop" 
                className="group inline-flex items-center justify-center bg-transparent text-[#111111] font-sans text-[11px] md:text-[12px] uppercase tracking-[0.2em] font-semibold px-10 py-[15px] border border-[#111111] transition-all duration-300 hover:bg-[#111111] hover:text-white"
              >
                Shop now
              </Link>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownBanner;
