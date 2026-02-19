import type { Toy } from '../../types';
import ToyCard from '../ToyCard/ToyCard';

interface ToyGridProps {
  toys: Toy[];
}

const ToyGrid = ({ toys }: ToyGridProps) => {
  return (
    <div>
      {toys.map((toy) => (
        <ToyCard key={toy.id} toy={toy} />
      ))}
    </div>
  );
};

export default ToyGrid;
