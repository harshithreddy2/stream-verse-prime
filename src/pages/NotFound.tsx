
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-netflix-background text-white">
      <Navbar />
      
      <div className="container mx-auto flex flex-col items-center justify-center pt-32 pb-16 px-4 text-center">
        <h1 className="text-6xl font-bold text-netflix-red mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
        <p className="text-xl text-gray-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-netflix-red hover:bg-red-700" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
