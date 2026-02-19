import type { Toy } from '../../types';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-hot-toast';
import ReviewStars from '../ReviewStars/ReviewStars';

interface ToyCardProps {
  toy: Toy;
}

const tipConfig: Record<string, { bg: string; emoji: string }> = {
  slagalica:  { bg: 'bg-purple-100', emoji: '🧩' },
  slikovnica: { bg: 'bg-sky-100',    emoji: '📚' },
  figura:     { bg: 'bg-orange-100', emoji: '🦖' },
  karakter:   { bg: 'bg-pink-100',   emoji: '👧' },
  edukativna: { bg: 'bg-green-100',  emoji: '🔬' },
  sportska:   { bg: 'bg-yellow-100', emoji: '⚽' },
};

const grupaBadge: Record<string, string> = {
  devojcica: 'bg-pink-100 text-pink-700',
  decak:     'bg-blue-100 text-blue-700',
  svi:       'bg-gray-100 text-gray-600',
};

const grupaLabel: Record<string, string> = {
  devojcica: 'Devojčica',
  decak:     'Dečak',
  svi:       'Svi',
};

const ToyCard = ({ toy }: ToyCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { items, addToCart } = useCart();

  const isInCart = items.some((i) => i.toyId === toy.id);
  const avgRating =
    toy.recenzije.length > 0
      ? toy.recenzije.reduce((sum, r) => sum + r.ocena, 0) / toy.recenzije.length
      : null;

  const config = tipConfig[toy.tip] ?? { bg: 'bg-gray-100', emoji: '🎁' };

  return (
    <div
      onClick={() => navigate(`/toy/${toy.id}`)}
      className="bg-white rounded-xl shadow-sm border border-[#e5e0d8] cursor-pointer hover:shadow-md transition-shadow flex flex-col overflow-hidden"
    >
      {/* Placeholder image */}
      <div className={`${config.bg} h-44 flex items-center justify-center text-6xl shrink-0`}>
        {config.emoji}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2">
          {toy.naziv}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span className="bg-sage-100 text-sage-700 text-xs font-medium px-2 py-0.5 rounded-full capitalize">
            {toy.tip}
          </span>
          <span className={`${grupaBadge[toy.ciljnaGrupa]} text-xs font-medium px-2 py-0.5 rounded-full`}>
            {grupaLabel[toy.ciljnaGrupa]}
          </span>
        </div>

        {/* Uzrast + cena */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Uzrast: {toy.uzrast} god.</span>
          <span className="font-semibold text-gray-800">
            {toy.cena.toLocaleString('sr-RS')} RSD
          </span>
        </div>

        {/* Rating */}
        <div className="text-sm">
          {avgRating !== null ? (
            <span className="flex items-center gap-1">
              <ReviewStars ocena={avgRating} />
              <span className="text-xs text-gray-400">({toy.recenzije.length})</span>
            </span>
          ) : (
            <span className="text-xs text-gray-400 italic">Nema recenzija</span>
          )}
        </div>

        <div className="flex-1" />

        {/* Reserve button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!user) {
              navigate('/login', { state: { from: location } });
              return;
            }
            addToCart(toy);
            toast.success(`"${toy.naziv}" je uspešno rezervisana!`);
          }}
          disabled={isInCart}
          className={`mt-1 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
            isInCart
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-sage-500 hover:bg-sage-700 text-white'
          }`}
        >
          {isInCart ? '✓ Rezervisano' : 'Rezerviši'}
        </button>
      </div>
    </div>
  );
};

export default ToyCard;
