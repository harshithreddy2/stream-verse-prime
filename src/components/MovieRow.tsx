
import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '@/types/movie';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

const MovieRow = ({ title, movies = [] }: MovieRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    const container = rowRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.75;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
      
    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    const container = rowRef.current;
    if (!container) return;
    
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  // Safeguard for when movies is null or undefined
  const moviesList = movies || [];
  
  if (moviesList.length === 0) return null;

  return (
    <div className="py-4">
      <h2 className="text-xl font-bold mb-4 px-4">{title}</h2>
      
      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        {/* Movies Row */}
        <div 
          ref={rowRef}
          className="flex space-x-4 overflow-x-auto py-4 scrollbar-hide px-4"
          onScroll={handleScroll}
        >
          {moviesList.map(movie => (
            <div key={movie.id} className="flex-shrink-0 w-[160px] md:w-[200px]">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
        
        {/* Right Arrow */}
        {showRightArrow && (
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('right')}
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieRow;
