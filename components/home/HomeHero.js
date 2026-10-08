'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const slides = [
  {
    image: '/1.jpeg',
    titleStart: 'Pi Bi',
    titleEnd: ' Open Intelligence',
    subtitle: 'An open community to learn, explore and build with AI.'
  },
  {
    image: '/2.jpeg',
    titleStart: 'Learn With the ',
    titleEnd: 'Madurai AI Community',
    subtitle: 'Weekly sessions, discussions and demos bring people together to understand AI, explore new technologies and learn from each other.'
  },
  {
    image: '/3.jpeg',
    titleStart: 'Discover. Build.',
    titleEnd: ' Share.',
    subtitle: 'Explore what others are building, try new ideas and share your own knowledge, projects, data or experiments.'
  },
  {
    image: '/4.jpeg',
    titleStart: 'Contribute and ',
    titleEnd: 'Put AI to Work',
    subtitle: 'Contribute models, tools, assistants, agents and resources, then apply them to real problems in business, education, health, agriculture, climate and communities.'
  },
  {
    image: '/5.jpeg',
    titleStart: 'Learn Contribute',
    titleEnd: ' Empower',
    subtitle: 'What starts with one person learning can become something useful for many others.'
  }
];

export default function HomeHero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 flex items-center justify-start">
      {/* Background Images */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
        >
          <img
            src={slides[current].image}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl px-8 md:px-16 mx-auto flex flex-col items-start justify-center mt-16">
        <div className="h-64 flex flex-col items-start justify-center text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] max-w-4xl">
                {slides[current].titleStart}{slides[current].titleEnd}
              </h1>
              <p className="text-lg md:text-2xl text-white font-medium max-w-2xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {slides[current].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 flex flex-col items-start gap-8"
        >
          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-300 border border-transparent rounded-full hover:scale-105 shadow-[0_4px_20px_rgba(46,196,182,0.4)]"
            style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' }}
          >
            Explore Open Intelligence &rarr;
          </Link>

          {/* Slide Indicators */}
          <div className="flex gap-3 mt-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${current === idx ? 'w-10' : 'w-2 bg-white/40'}`}
                style={current === idx ? { background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' } : {}}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
