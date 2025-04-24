
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie } from '@/types/movie';
import { posterSizes } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard = ({ movie, className = '' }: MovieCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, addToWatchlist, removeFromWatchlist, isInWatchlist } = useAuth();
  
  const inWatchlist = user ? isInWatchlist(movie.id) : false;

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie.id);
    }
  };

  return (
    <Link to={`/movie/${movie.id}`} className={`movie-card block ${className}`}>
      {/* Poster Image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-gray-900">
        {movie.poster_path ? (
          <img 
            src={`${posterSizes.medium}${movie.poster_path}`} 
            alt={movie.title}
            className={`h-full w-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-800">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        
        {/* Overlay */}
        <div className="movie-card-overlay">
          <h3 className="text-sm font-medium text-white mb-1 line-clamp-1">{movie.title}</h3>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">
              {movie.release_date && new Date(movie.release_date).getFullYear()}
            </span>
            <span className="flex items-center text-xs text-yellow-400">
              ★ {movie.vote_average.toFixed(1)}
            </span>
          </div>
          
          <div className="mt-2 flex space-x-1">
            <Button size="icon" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              <Play size={15} className="text-white" />
            </Button>
            
            {user && (
              <Button 
                size="icon" 
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                onClick={handleWatchlist}
              >
                {inWatchlist ? (
                  <Check size={15} className="text-netflix-red" />
                ) : (
                  <Plus size={15} className="text-white" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
