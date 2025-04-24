import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Check, Star, Calendar, Clock, User as UserIcon, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchMovieDetails, posterSizes, backdropSizes } from '@/services/api';
import { Movie } from '@/types/movie';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const { user, addToWatchlist, removeFromWatchlist, isInWatchlist } = useAuth();

  const inWatchlist = movie && user ? isInWatchlist(movie.id) : false;

  useEffect(() => {
    const loadMovie = async () => {
      if (id) {
        setLoading(true);
        try {
          const data = await fetchMovieDetails(id);
          setMovie(data);
        } catch (error) {
          console.error('Error loading movie details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadMovie();
  }, [id]);

  const handleWatchlist = () => {
    if (!movie) return;
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie.id);
    }
  };

  // Find the first available trailer
  const trailer = movie?.videos?.results.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer'
  );

  // Format movie duration as hours and minutes
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-netflix-background text-white">
      <Navbar />
      
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : movie ? (
        <>
          {/* Backdrop with gradient overlays */}
          <div className="relative min-h-screen">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${backdropSizes.large}${movie.backdrop_path})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-netflix-background via-transparent opacity-90" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 container mx-auto pt-28 px-4">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Poster */}
                <div className="w-full md:w-1/4 flex-shrink-0">
                  <div className="rounded-lg overflow-hidden shadow-xl">
                    <img 
                      src={`${posterSizes.large}${movie.poster_path}`} 
                      alt={movie.title}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                
                {/* Details */}
                <div className="w-full md:w-3/4">
                  <h1 className="text-3xl md:text-5xl font-bold mb-2">{movie.title}</h1>
                  
                  {movie.tagline && (
                    <p className="text-gray-400 text-xl italic mb-4">{movie.tagline}</p>
                  )}
                  
                  {/* Info row */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center">
                      <Star className="text-yellow-400 mr-1" size={18} />
                      <span>{movie.vote_average.toFixed(1)}/10</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="text-gray-400 mr-1" size={18} />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                    
                    {movie.runtime && (
                      <div className="flex items-center">
                        <Clock className="text-gray-400 mr-1" size={18} />
                        <span>{formatRuntime(movie.runtime)}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genres.map(genre => (
                      <Link key={genre.id} to={`/genre/${genre.id}`}>
                        <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                          {genre.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Overview */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">Overview</h3>
                    <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-wrap gap-4">
                    {trailer && (
                      <Button 
                        size="lg" 
                        className="bg-white text-black hover:bg-gray-200"
                        onClick={() => setShowTrailer(true)}
                      >
                        <Play className="mr-2" size={18} />
                        Watch Trailer
                      </Button>
                    )}
                    
                    {user && (
                      <Button 
                        variant={inWatchlist ? "outline" : "default"}
                        size="lg"
                        onClick={handleWatchlist}
                      >
                        {inWatchlist ? (
                          <>
                            <Check className="mr-2" size={18} />
                            Added to List
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2" size={18} />
                            Add to My List
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  
                  {/* Cast */}
                  {movie.credits && movie.credits.cast.length > 0 && (
                    <div className="mt-12">
                      <h3 className="text-xl font-semibold mb-4">Cast</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {movie.credits.cast.slice(0, 6).map(person => (
                          <div key={person.id} className="text-center">
                            <div className="w-full aspect-square rounded-full overflow-hidden bg-gray-800 mb-2">
                              {person.profile_path ? (
                                <img 
                                  src={`${posterSizes.small}${person.profile_path}`} 
                                  alt={person.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <UserIcon size={24} className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <p className="font-medium truncate">{person.name}</p>
                            <p className="text-sm text-gray-400 truncate">{person.character}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Trailer Modal */}
          {showTrailer && trailer && (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
              <div className="relative w-full max-w-5xl">
                <button 
                  className="absolute -top-12 right-0 text-white hover:text-gray-300"
                  onClick={() => setShowTrailer(false)}
                >
                  <XIcon size={24} />
                </button>
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-bold mb-4">Movie Not Found</h2>
          <p className="text-gray-400 mb-6">The movie you're looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
