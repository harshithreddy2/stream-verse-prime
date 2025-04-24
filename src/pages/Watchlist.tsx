
import { useState, useEffect } from 'react';
import { Movie } from '@/types/movie';
import { fetchMovieDetails } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProtectedRoute from '@/components/ProtectedRoute';

const Watchlist = () => {
  const { user } = useAuth();
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlistMovies = async () => {
      if (!user || !user.watchlist.length) {
        setWatchlistMovies([]);
        setLoading(false);
        return;
      }

      try {
        const moviePromises = user.watchlist.map(id => 
          fetchMovieDetails(id.toString())
        );
        
        const movies = await Promise.all(moviePromises);
        setWatchlistMovies(movies.filter(Boolean) as Movie[]);
      } catch (error) {
        console.error('Error fetching watchlist movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistMovies();
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-netflix-background text-white">
        <Navbar />
        
        <div className="container mx-auto pt-32 pb-16 px-4">
          <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
          
          {loading ? (
            <LoadingSpinner />
          ) : watchlistMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {watchlistMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400 mb-4">
                Your watchlist is empty
              </p>
              <p className="text-gray-500">
                Browse movies and add them to your list to watch later
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Watchlist;
