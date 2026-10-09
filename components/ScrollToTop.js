'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const yOffset = -80; // Offset for sticky navbar header
      const y = aboutSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: Math.max(0, y),
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollY > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, []);

  if (pathname !== '/') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-[99]">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="p-3 md:p-4 rounded-full bg-white text-[#1f6fb2] shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300 border border-slate-200 cursor-pointer"
          aria-label="Scroll to About section"
        >
          <ArrowUp className="w-6 h-6 md:w-7 md:h-7 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}


