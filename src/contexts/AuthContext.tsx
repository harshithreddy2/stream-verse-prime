
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface User {
  id: string;
  email: string;
  name: string;
  watchlist: number[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  addToWatchlist: (movieId: number) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    watchlist: [550, 299536, 299534]
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('streamverse_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser && password === 'password123') { // Super secure for demo :)
        setUser(foundUser);
        localStorage.setItem('streamverse_user', JSON.stringify(foundUser));
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
        return;
      }
      
      throw new Error('Invalid email or password');
    } catch (error) {
      toast({
        title: "Login failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        email,
        name,
        watchlist: []
      };
      
      mockUsers.push(newUser);
      setUser(newUser);
      localStorage.setItem('streamverse_user', JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('streamverse_user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const addToWatchlist = (movieId: number) => {
    if (!user) return;
    
    if (!user.watchlist.includes(movieId)) {
      const updatedUser = {
        ...user,
        watchlist: [...user.watchlist, movieId]
      };
      setUser(updatedUser);
      localStorage.setItem('streamverse_user', JSON.stringify(updatedUser));
      toast({
        title: "Added to Watchlist",
        description: "Movie added to your watchlist",
      });
    }
  };

  const removeFromWatchlist = (movieId: number) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      watchlist: user.watchlist.filter(id => id !== movieId)
    };
    setUser(updatedUser);
    localStorage.setItem('streamverse_user', JSON.stringify(updatedUser));
    toast({
      title: "Removed from Watchlist",
      description: "Movie removed from your watchlist",
    });
  };

  const isInWatchlist = (movieId: number) => {
    return user ? user.watchlist.includes(movieId) : false;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
