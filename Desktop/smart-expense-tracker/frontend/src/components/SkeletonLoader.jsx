import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonLoader = ({ count = 1, height = 40, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} height={height} className="rounded-xl" />
      ))}
    </div>
  );
};

export default SkeletonLoader;
