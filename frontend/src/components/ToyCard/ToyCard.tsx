import { Toy } from '../../types';

interface ToyCardProps {
  toy: Toy;
}

const ToyCard = ({ toy }: ToyCardProps) => {
  return (
    <div>
      <h2>{toy.naziv}</h2>
    </div>
  );
};

export default ToyCard;
