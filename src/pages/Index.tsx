
import { useState, useEffect } from 'react';
import { fetchTrending, fetchPopular, fetchTopRated, fetchUpcoming, fetchTVPopular } from '@/services/api';
import { Movie } from '@/types/movie';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trending, popular, topRated, upcoming, tvPopular] = await Promise.all([
          fetchTrending(),
          fetchPopular(),
          fetchTopRated(),
          fetchUpcoming(),
          fetchTVPopular()
        ]);

        // Check if any data was returned successfully
        if (trending.length === 0 && popular.length === 0 && 
            topRated.length === 0 && upcoming.length === 0 && 
            tvPopular.length === 0) {
          setError('Unable to fetch movie data. API key may be invalid or network issues occurred.');
        }

        setTrendingMovies(trending);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setUpcomingMovies(upcoming);
        setTvShows(tvPopular);

        // Select a random trending movie for the hero
        if (trending && trending.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(5, trending.length));
          setHeroMovie(trending[randomIndex]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('An error occurred while loading movie data.');
        toast({
          title: "Error",
          description: "Failed to load movie data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-netflix-background text-white">
      <Navbar />

      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="min-h-screen flex items-center justify-center flex-col px-4">
          <h2 className="text-2xl font-bold text-netflix-red mb-4">Error Loading Data</h2>
          <p className="text-center mb-6">{error}</p>
          <p className="text-center text-sm text-gray-400">
            Please check your internet connection and try again later.
            <br />
            Note: The API key may be invalid or expired.
          </p>
        </div>
      ) : (
        <>
          {heroMovie && <Hero movie={heroMovie} />}
          
          <div className="container mx-auto pb-16">
            <MovieRow title="Trending Now" movies={trendingMovies} />
            <MovieRow title="Popular Movies" movies={popularMovies} />
            <MovieRow title="Top Rated" movies={topRatedMovies} />
            <MovieRow title="Coming Soon" movies={upcomingMovies} />
            <MovieRow title="Popular TV Shows" movies={tvShows} />
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
