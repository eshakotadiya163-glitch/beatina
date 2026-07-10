import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    <section className="bg-[#ffebf4] py-[40px] lg:py-[70px]">
      <div className="container-fluid mx-auto px-4 md:px-8 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row items-center">
          
          {/* Left Column - Text */}
          <div className="w-full lg:w-5/12 text-center lg:text-left mb-6 lg:mb-0">
            <h3 className="font-heading text-3xl md:text-[32px] text-black mb-2">
              Seasonal Savings Event
            </h3>
            <div className="font-body text-black text-[15px]">
              Up to 30% Off on Must-Have Styles !
            </div>
          </div>
          
          {/* Right Column - Timer & Button */}
          <div className="w-full lg:w-7/12 flex flex-col lg:flex-row items-center justify-between mt-4 lg:mt-0">
            
            {/* Timer Blocks */}
            <div className="flex items-center">
              <ul className="flex items-center m-0 p-0 list-none">
                {Object.entries(timeLeft).map(([unit, value], index, array) => (
                  <li 
                    key={unit} 
                    className={`px-3 md:px-4 text-center leading-none ${index !== array.length - 1 ? 'border-r border-black/20' : ''}`}
                  >
                    <span className="block font-heading text-[28px] md:text-[36px] text-black mb-1 min-w-[50px] md:min-w-[64px]">
                      {value.toString().padStart(2, '0')}
                    </span>
                    <span className="block font-body text-[10px] md:text-xs tracking-[1.2px] md:tracking-[1.7px] uppercase text-black">
                      {unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Button */}
            <div className="mt-6 lg:mt-0">
              <Link 
                to="/shop" 
                className="inline-block bg-transparent border border-black text-black font-body text-[14px] px-8 py-3 hover:bg-black hover:text-white transition-colors"
              >
                Shop now
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownBanner;
