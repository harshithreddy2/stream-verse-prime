
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie } from '@/types/movie';
import { backdropSizes } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface HeroProps {
  movie: Movie;
}

const Hero = ({ movie }: HeroProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, addToWatchlist, isInWatchlist } = useAuth();
  
  useEffect(() => {
    if (movie) {
      // Preload the backdrop image
      const img = new Image();
      img.src = `${backdropSizes.large}${movie.backdrop_path}`;
      img.onload = () => setIsLoading(false);
    }
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="relative h-[80vh] w-full">
      {/* Backdrop Image */}
      {!isLoading && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${backdropSizes.large}${movie.backdrop_path})`,
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-background via-transparent opacity-90" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full container mx-auto flex flex-col justify-end pb-16 px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{movie.title}</h1>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <Star className="text-yellow-400" size={20} />
            <span className="ml-1 text-white">
              {movie.vote_average.toFixed(1)}/10
            </span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-300">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>
          
          <p className="text-white/80 text-lg mb-6 line-clamp-3">
            {movie.overview}
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Link to={`/movie/${movie.id}`}>
              <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                <Play className="mr-2" size={18} />
                Watch Now
              </Button>
            </Link>
            
            {user && (
              <Button 
                variant="outline"
                size="lg" 
                className="border-gray-400 text-white hover:bg-white/10"
                onClick={() => addToWatchlist(movie.id)}
                disabled={isInWatchlist(movie.id)}
              >
                <Plus className="mr-2" size={18} />
                {isInWatchlist(movie.id) ? 'Added to List' : 'Add to My List'}
              </Button>
            )}
            
            <Link to={`/movie/${movie.id}`}>
              <Button variant="link" size="lg" className="text-white hover:text-gray-300">
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
