import type { Toy } from '../../types';
import ToyCard from '../ToyCard/ToyCard';

interface ToyGridProps {
  toys: Toy[];
}

const ToyGrid = ({ toys }: ToyGridProps) => {
  if (toys.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-500 italic text-sm">
        Nema igračaka koje odgovaraju filterima.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {toys.map((toy) => (
        <ToyCard key={toy.id} toy={toy} />
      ))}
    </div>
  );
};

export default ToyGrid;
