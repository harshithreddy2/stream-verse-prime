
import { Loader } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-40 w-full">
      <Loader className="h-8 w-8 animate-spin text-netflix-red" />
    </div>
  );
};

export default LoadingSpinner;
