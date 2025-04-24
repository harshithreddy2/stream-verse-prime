
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-colors duration-300 ${
        isScrolled ? 'bg-netflix-background' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-netflix-red">
            StreamVerse
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link to="/movies" className="text-white hover:text-gray-300 transition-colors">
            Movies
          </Link>
          <Link to="/tv" className="text-white hover:text-gray-300 transition-colors">
            TV Shows
          </Link>
          {user && (
            <Link to="/watchlist" className="text-white hover:text-gray-300 transition-colors">
              My List
            </Link>
          )}
        </nav>

        {/* Search and User Actions (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-black/30 border border-gray-700 rounded-md px-4 py-1 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-netflix-red"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <Search size={16} />
            </button>
          </form>
          
          {user ? (
            <div className="flex items-center space-x-3">
              <Link to="/profile" className="text-white hover:text-gray-300">
                <User size={20} />
              </Link>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="text-white border-gray-600 hover:bg-gray-800"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-netflix-background absolute top-full left-0 right-0 p-4 flex flex-col space-y-4 shadow-lg">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-black/50 border border-gray-700 rounded-md px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-netflix-red"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <Search size={18} />
            </button>
          </form>
          
          <Link to="/" className="text-white py-2 hover:text-gray-300">
            Home
          </Link>
          <Link to="/movies" className="text-white py-2 hover:text-gray-300">
            Movies
          </Link>
          <Link to="/tv" className="text-white py-2 hover:text-gray-300">
            TV Shows
          </Link>
          {user && (
            <Link to="/watchlist" className="text-white py-2 hover:text-gray-300">
              My List
            </Link>
          )}
          
          {user ? (
            <>
              <Link to="/profile" className="text-white py-2 hover:text-gray-300">
                Profile
              </Link>
              <Button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/login" className="w-full">
              <Button variant="default" size="sm" className="w-full">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
