import { useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { CartItem, ReservationStatus } from '../types';

const STATUS_BADGE: Record<string, string> = {
  rezervisano: 'bg-amber-100 text-amber-800',
  pristiglo: 'bg-green-100 text-green-800',
  otkazano: 'bg-red-100 text-red-800',
};

const STATUS_LABEL: Record<string, string> = {
  rezervisano: 'Rezervisano',
  pristiglo: 'Pristiglo',
  otkazano: 'Otkazano',
};

const CartItemRow = ({
  item,
  onRemove,
  onUpdateStatus,
  onRate,
}: {
  item: CartItem;
  onRemove: () => void;
  onUpdateStatus: (status: ReservationStatus) => void;
  onRate: (ocena: number) => void;
}) => {
  const [ocenaUnos, setOcenaUnos] = useState(0);
  const [showOcena, setShowOcena] = useState(false);

  const handleRate = () => {
    if (ocenaUnos === 0) return;
    onRate(ocenaUnos);
    setShowOcena(false);
    toast.success(`Ocenili ste "${item.toy.naziv}".`);
  };

  const hasDemoButtons =
    item.status === 'rezervisano' || item.status === 'pristiglo';

  return (
    <div className="bg-white rounded-xl border border-[#e5e0d8] p-4 flex flex-col gap-3">
      {/* Info */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            to={`/toy/${item.toyId}`}
            className="font-semibold text-gray-900 hover:text-sage-700"
          >
            {item.toy.naziv}
          </Link>
          <p className="text-sm text-gray-500 mt-0.5">
            {item.toy.tip} · {item.toy.cena.toLocaleString('sr-RS')} RSD
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Rezervisano: {new Date(item.datumRezervacije).toLocaleDateString('sr-RS')}
          </p>
        </div>
        <span
          className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${STATUS_BADGE[item.status]}`}
        >
          {STATUS_LABEL[item.status]}
        </span>
      </div>

      {/* Existing rating */}
      {item.ocena !== undefined && (
        <p className="text-sm text-gray-600">
          Vasa ocena:{' '}
          <span className="text-amber-400">{'★'.repeat(item.ocena)}</span>
          <span className="text-gray-300">{'★'.repeat(5 - item.ocena)}</span>
        </p>
      )}

      {/* Inline rating form */}
      {showOcena && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setOcenaUnos(s)}
                className={`text-2xl transition-colors ${
                  s <= ocenaUnos ? 'text-amber-400' : 'text-gray-300 hover:text-amber-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <button
            onClick={handleRate}
            disabled={ocenaUnos === 0}
            className="text-sm bg-sage-500 hover:bg-sage-700 text-white px-3 py-1 rounded-lg disabled:opacity-40 transition-colors"
          >
            Potvrdi
          </button>
          <button
            onClick={() => setShowOcena(false)}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Otkazi
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {item.status === 'pristiglo' &&
          item.ocena === undefined &&
          !showOcena && (
            <button
              onClick={() => setShowOcena(true)}
              className="text-sm border border-sage-500 text-sage-700 hover:bg-sage-50 rounded-lg px-3 py-1 transition-colors"
            >
              Oceni
            </button>
          )}
        <button
          onClick={() => {
            onRemove();
            toast.success(`"${item.toy.naziv}" uklonjena iz korpe.`);
          }}
          className="text-sm border border-red-300 text-red-600 hover:bg-red-50 rounded-lg px-3 py-1 transition-colors"
        >
          Obrisi
        </button>
      </div>

      {/* Demo buttons */}
      {hasDemoButtons && (
        <div className="border-t border-dashed border-gray-200 pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400">Demo:</span>
          {item.status === 'rezervisano' && (
            <button
              onClick={() => {
                onUpdateStatus('pristiglo');
                toast.success('Status promenjen na "Pristiglo".');
              }}
              className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded transition-colors"
            >
              {/* Simuliraj: Pristiglo */}
              Pristiglo
            </button>
          )}
          <button
            onClick={() => {
              onUpdateStatus('otkazano');
              toast.success('Status promenjen na "Otkazano".');
            }}
            className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded transition-colors"
          >
            {/* Simuliraj: Otkazano */}
            Otkazano
          </button>
        </div>
      )}
    </div>
  );
};

const Cart = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { items, removeFromCart, updateStatus, rateItem } = useCart();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const ukupnaCena = items
    .filter((i) => i.status === 'rezervisano' || i.status === 'pristiglo')
    .reduce((sum, i) => sum + i.toy.cena, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Moja korpa</h1>
      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5e0d8] p-8 text-center text-gray-500">
          Korpa je prazna.{' '}
          <Link to="/" className="text-sage-700 hover:underline font-medium">
            Pogledaj igracke
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <CartItemRow
              key={item.toyId}
              item={item}
              onRemove={() => removeFromCart(item.toyId)}
              onUpdateStatus={(status) => updateStatus(item.toyId, status)}
              onRate={(ocena) => rateItem(item.toyId, ocena)}
            />
          ))}
          <div className="bg-white rounded-xl border border-[#e5e0d8] p-4 flex justify-between items-center">
            <span className="font-semibold text-gray-700">
              Ukupno (rezervisano + pristiglo):
            </span>
            <span className="text-xl font-bold text-gray-900">
              {ukupnaCena.toLocaleString('sr-RS')} RSD
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
