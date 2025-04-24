
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Loader } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError((err as Error).message || 'Failed to log in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-netflix-background p-4">
      <div className="w-full max-w-md p-8 bg-netflix-card rounded-lg shadow-xl">
        <Link to="/" className="block mb-8 text-center">
          <h1 className="text-4xl font-bold text-netflix-red">StreamVerse</h1>
        </Link>
        
        <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
        
        {error && (
          <div className="bg-red-900/50 border border-red-800 text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-netflix-red hover:bg-red-700"
            disabled={loading}
          >
            {loading ? (
              <Loader size={18} className="animate-spin mr-2" />
            ) : null}
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            New to StreamVerse?{' '}
            <Link to="/register" className="text-white hover:underline">
              Sign up now
            </Link>
          </p>
        </div>
        
        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>For demo purposes, use:</p>
          <p className="mt-2">Email: user@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
