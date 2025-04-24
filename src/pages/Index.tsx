
import { useState, useEffect } from 'react';
import { fetchTrending, fetchPopular, fetchTopRated, fetchUpcoming, fetchTVPopular } from '@/services/api';
import { Movie } from '@/types/movie';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';
import LoadingSpinner from '@/components/LoadingSpinner';

const Index = () => {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

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

        setTrendingMovies(trending);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setUpcomingMovies(upcoming);
        setTvShows(tvPopular);

        // Select a random trending movie for the hero
        if (trending.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(5, trending.length));
          setHeroMovie(trending[randomIndex]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
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
