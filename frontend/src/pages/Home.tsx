import { useState, useMemo } from 'react';
import type { FilterState } from '../types';
import { toys } from '../data/toys';
import ToyGrid from '../components/ToyGrid/ToyGrid';
import SearchFilters, { DEFAULT_FILTERS } from '../components/SearchFilters/SearchFilters';

/** Parses "3-6" → [3, 6] and "10+" → [10, 999] */
const parseRange = (s: string): [number, number] => {
  if (s.endsWith('+')) return [parseInt(s, 10), 999];
  const parts = s.split('-').map(Number);
  return [parts[0], parts[1]];
};

const Home = () => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    return toys.filter((toy) => {
      // Naziv
      if (filters.naziv && !toy.naziv.toLowerCase().includes(filters.naziv.toLowerCase()))
        return false;

      // Opis
      if (filters.opis && !toy.opis.toLowerCase().includes(filters.opis.toLowerCase()))
        return false;

      // Tip
      if (filters.tip.length > 0 && !filters.tip.includes(toy.tip)) return false;

      // Uzrast — overlap check
      if (filters.uzrast) {
        const [fMin, fMax] = parseRange(filters.uzrast);
        const [tMin, tMax] = parseRange(toy.uzrast);
        if (tMin > fMax || tMax < fMin) return false;
      }

      // Ciljna grupa
      if (filters.ciljnaGrupa && toy.ciljnaGrupa !== filters.ciljnaGrupa) return false;

      // Datum proizvodnje
      if (filters.datumOd && toy.datumProizvodnje < filters.datumOd) return false;
      if (filters.datumDo && toy.datumProizvodnje > filters.datumDo) return false;

      // Cena
      if (toy.cena < filters.cenaMin || toy.cena > filters.cenaMax) return false;

      // Ocena
      if (filters.ocenaMin > 0) {
        if (toy.recenzije.length === 0) return false;
        const avg = toy.recenzije.reduce((sum, r) => sum + r.ocena, 0) / toy.recenzije.length;
        if (avg < filters.ocenaMin) return false;
      }

      return true;
    });
  }, [filters]);

  const count = filtered.length;
  const countLabel = count === 1 ? 'igračka' : count >= 2 && count <= 4 ? 'igračke' : 'igračaka';

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <div className="w-72 shrink-0 sticky top-[4.5rem]">
            <SearchFilters filters={filters} onChange={setFilters} />
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl font-bold text-gray-900">Igračke</h1>
              <span className="text-sm text-gray-500">
                {count} {countLabel}
              </span>
            </div>
            <ToyGrid toys={filtered} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
