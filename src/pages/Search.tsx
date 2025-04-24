import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { searchMovies, fetchGenres } from '@/services/api';
import { Movie } from '@/types/movie';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<{id: number, name: string}[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [yearFilter, setYearFilter] = useState<string>('');
  
  // Filter the results based on genre and year
  const filteredResults = results.filter(movie => {
    const matchesGenre = !selectedGenre || movie.genres?.some(genre => genre.id === selectedGenre);
    const matchesYear = !yearFilter || 
      (movie.release_date && movie.release_date.startsWith(yearFilter));
    
    return matchesGenre && matchesYear;
  });

  useEffect(() => {
    const loadGenres = async () => {
      const genreList = await fetchGenres();
      setGenres(genreList);
    };
    
    loadGenres();
  }, []);

  useEffect(() => {
    if (queryParam) {
      search(queryParam);
    }
  }, [queryParam]);

  const search = async (term: string) => {
    if (!term.trim()) return;
    
    setLoading(true);
    try {
      const data = await searchMovies(term);
      setResults(data);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
      search(searchTerm.trim());
    }
  };

  return (
    <div className="min-h-screen bg-netflix-background text-white">
      <Navbar />
      
      <div className="container mx-auto pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-6">Search Movies</h1>
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for movies..."
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Button type="submit">
              <SearchIcon size={18} className="mr-2" />
              Search
            </Button>
          </form>
        </div>
        
        {queryParam && (
          <>
            {/* Filter controls */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-4">
                {/* Genre filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Genre</label>
                  <select
                    value={selectedGenre || ''}
                    onChange={(e) => setSelectedGenre(e.target.value ? Number(e.target.value) : null)}
                    className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 w-full max-w-xs"
                  >
                    <option value="">All Genres</option>
                    {genres.map(genre => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Year filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Release Year</label>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 w-full max-w-xs"
                  >
                    <option value="">All Years</option>
                    {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Results */}
            {loading ? (
              <LoadingSpinner />
            ) : filteredResults.length > 0 ? (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Search Results {filteredResults.length !== results.length && 
                    `(${filteredResults.length} of ${results.length})`}
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredResults.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">
                  No movies found for "{queryParam}"
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
