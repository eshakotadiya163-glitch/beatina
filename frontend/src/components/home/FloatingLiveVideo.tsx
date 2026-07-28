import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const videos = [
  "/images/migrated/40_b11b019c831543709c9f0852c3d79b21.HD-1080p-3.3Mbps-77545356.mp4",
  "/images/migrated/42_788b041920114347915fb7d4a16de257.HD-1080p-7.2Mbps-77545360.mp4",
  "/images/migrated/44_fb984906407f4fb9b5c5ceb14dd78350.HD-1080p-2.5Mbps-77626008.mp4",
  "/images/migrated/46_4b2f2c0725434683af01f499b85d7b90.HD-1080p-4.8Mbps-77545359.mp4"
];

const FloatingLiveVideo = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 3000); // Change video every 3 seconds

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed bottom-6 right-6 z-[100] w-[140px] h-[220px] rounded-xl overflow-hidden shadow-2xl border-2 border-white cursor-pointer group"
        onClick={() => {
          // Could open a larger video modal or redirect
        }}
      >
        {/* Close Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video Element */}
        <video 
          key={videos[currentVideoIndex]} // Force re-render on video change to trigger autoplay
          className="w-full h-full object-cover bg-gray-200"
          autoPlay 
          muted 
          loop 
          playsInline
          src={videos[currentVideoIndex]}
        />

        {/* Play Icon Overlay (Optional) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
           <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
             </svg>
           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingLiveVideo;
