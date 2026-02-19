import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import type { Review } from '../types';
import { toys as allToys } from '../data/toys';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ReviewStars from '../components/ReviewStars/ReviewStars';

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

const ToyDetail = () => {
  const { id } = useParams<{ id: string }>();   //povlacimo id iz url-a
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { items, addToCart, rateItem } = useCart();

  const toy = allToys.find((t) => t.id === id);

  // Local copy of reviews so we can add new ones without mutating the original array
  const [localRecenzije, setLocalRecenzije] = useState<Review[]>(toy?.recenzije ?? []);

  // Rating form state
  const [reviewOcena, setReviewOcena] = useState(0);
  const [reviewTekst, setReviewTekst] = useState('');

  if (!toy) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-400 mb-4">Igračka nije pronađena.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-sage-500 hover:bg-sage-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Nazad na početnu
          </button>
        </div>
      </div>
    );
  }

  const config = tipConfig[toy.tip] ?? { bg: 'bg-gray-100', emoji: '🎁' };
  const cartItem = items.find((i) => i.toyId === toy.id);
  const isInCart = !!cartItem;
  const canRate = cartItem?.status === 'pristiglo' && cartItem.ocena === undefined;

  const avgRating =
    localRecenzije.length > 0
      ? localRecenzije.reduce((sum, r) => sum + r.ocena, 0) / localRecenzije.length
      : null;

  const handleRezervisati = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    addToCart(toy);
    toast.success(`"${toy.naziv}" je uspešno rezervisana!`);
  };

  const handleOceni = () => {
    if (reviewOcena === 0) {
      toast.error('Izaberi ocenu pre slanja.');
      return;
    }
    const novaRecenzija: Review = {
      id: crypto.randomUUID(),
      autor: user ? `${user.ime} ${user.prezime}` : 'Anoniman',
      tekst: reviewTekst.trim(),
      ocena: reviewOcena,
      datum: new Date().toISOString().split('T')[0],
    };
    setLocalRecenzije((prev) => [novaRecenzija, ...prev]);
    rateItem(toy.id, reviewOcena);
    toast.success('Ocena je uspešno sačuvana!');
    setReviewOcena(0);
    setReviewTekst('');
  };

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-sage-600 hover:text-sage-800 font-medium mb-6 flex items-center gap-1 transition-colors"
        >
          ← Nazad
        </button>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e5e0d8] overflow-hidden mb-6">

          {/* Hero image placeholder */}
          <div className={`${config.bg} h-56 flex items-center justify-center text-8xl`}>
            {config.emoji}
          </div>

          <div className="p-6">
            {/* Title + badges */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{toy.naziv}</h1>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-sage-100 text-sage-700 text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                  {toy.tip}
                </span>
                <span className={`${grupaBadge[toy.ciljnaGrupa]} text-xs font-medium px-2.5 py-1 rounded-full`}>
                  {grupaLabel[toy.ciljnaGrupa]}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-5">{toy.opis}</p>

            {/* Details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">Uzrast</p>
                <p className="font-semibold text-gray-800 text-sm">{toy.uzrast} god.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">Cena</p>
                <p className="font-semibold text-gray-800 text-sm">{toy.cena.toLocaleString('sr-RS')} RSD</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">Datum proizvodnje</p>
                <p className="font-semibold text-gray-800 text-sm">{toy.datumProizvodnje}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-0.5">Ocena</p>
                <p className="font-semibold text-gray-800 text-sm">
                  {avgRating !== null ? (
                    <span className="flex items-center gap-1">
                      <ReviewStars ocena={avgRating} />
                      <span className="text-xs text-gray-400">({localRecenzije.length})</span>
                    </span>
                  ) : (
                    <span className="text-gray-400 font-normal text-xs italic">Nema ocena</span>
                  )}
                </p>
              </div>
            </div>

            {/* Rezervisi button */}
            <button
              onClick={handleRezervisati}
              disabled={isInCart}
              className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isInCart
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-sage-500 hover:bg-sage-700 text-white'
              }`}
            >
              {isInCart ? '✓ Rezervisano' : 'Rezerviši'}
            </button>
          </div>
        </div>

        {/* Rating form — only if pristiglo and not yet rated */}
        {canRate && (
          <div className="bg-white rounded-xl shadow-sm border border-[#e5e0d8] p-6 mb-6">
            <h2 className="font-bold text-gray-900 text-base mb-4">Oceni igračku</h2>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm text-gray-600 mb-1.5">Tvoja ocena</p>
                <ReviewStars ocena={reviewOcena} editable onChange={setReviewOcena} />
              </div>
              <textarea
                value={reviewTekst}
                onChange={(e) => setReviewTekst(e.target.value)}
                placeholder="Komentar (opciono)..."
                rows={3}
                className="w-full border border-[#e5e0d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 resize-none"
              />
              <button
                onClick={handleOceni}
                className="self-start bg-sage-500 hover:bg-sage-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Pošalji ocenu
              </button>
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="bg-white rounded-xl shadow-sm border border-[#e5e0d8] p-6">
          <h2 className="font-bold text-gray-900 text-base mb-4">
            Recenzije
            {localRecenzije.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">({localRecenzije.length})</span>
            )}
          </h2>

          {localRecenzije.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Još nema recenzija.</p>
          ) : (
            <div className="flex flex-col divide-y divide-[#e5e0d8]">
              {localRecenzije.map((r) => (
                <div key={r.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-800">{r.autor}</span>
                    <span className="text-xs text-gray-400">{r.datum}</span>
                  </div>
                  <ReviewStars ocena={r.ocena} />
                  {r.tekst && (
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{r.tekst}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ToyDetail;
