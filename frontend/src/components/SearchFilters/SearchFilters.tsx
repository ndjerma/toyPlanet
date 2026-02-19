import type { FilterState, ToyType, TargetGroup } from '../../types';

const TOY_TYPES: { value: ToyType; label: string }[] = [
  { value: 'slagalica',  label: 'Slagalica' },
  { value: 'slikovnica', label: 'Slikovnica' },
  { value: 'figura',     label: 'Figura' },
  { value: 'karakter',   label: 'Karakter' },
  { value: 'edukativna', label: 'Edukativna' },
  { value: 'sportska',   label: 'Sportska' },
];

const UZRAST_OPTIONS: { value: string; label: string }[] = [
  { value: '',     label: 'Svi uzrasti' },
  { value: '0-2',  label: '0–2 godine' },
  { value: '2-5',  label: '2–5 godina' },
  { value: '5-10', label: '5–10 godina' },
  { value: '10+',  label: '10+ godina' },
];

const CILJNA_GRUPA_OPTIONS: { value: TargetGroup | ''; label: string }[] = [
  { value: '',          label: 'Sve' },
  { value: 'devojcica', label: 'Devojčica' },
  { value: 'decak',     label: 'Dečak' },
  { value: 'svi',       label: 'Za sve' },
];

export const DEFAULT_FILTERS: FilterState = {
  naziv: '',
  opis: '',
  tip: [],
  uzrast: '',
  ciljnaGrupa: '',
  datumOd: '',
  datumDo: '',
  cenaMin: 0,
  cenaMax: 6000,
  ocenaMin: 0,
};

interface SearchFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const inputClass =
  'w-full border border-[#e5e0d8] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 bg-white';
const labelClass = 'block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide';

const SearchFilters = ({ filters, onChange }: SearchFiltersProps) => {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value });

  const toggleTip = (tip: ToyType) => {
    const already = filters.tip.includes(tip);
    set('tip', already ? filters.tip.filter((t) => t !== tip) : [...filters.tip, tip]);
  };

  return (
    <aside className="bg-white rounded-xl shadow-sm border border-[#e5e0d8] p-5 flex flex-col gap-5 max-h-[calc(100vh-6rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900 text-base">Filteri</h2>
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="text-xs text-sage-600 hover:text-sage-800 font-medium transition-colors"
        >
          Resetuj sve
        </button>
      </div>

      {/* Naziv */}
      <div>
        <label className={labelClass}>Naziv</label>
        <input
          type="text"
          className={inputClass}
          placeholder="Pretraži naziv..."
          value={filters.naziv}
          onChange={(e) => set('naziv', e.target.value)}
        />
      </div>

      {/* Opis */}
      <div>
        <label className={labelClass}>Opis</label>
        <input
          type="text"
          className={inputClass}
          placeholder="Pretraži opis..."
          value={filters.opis}
          onChange={(e) => set('opis', e.target.value)}
        />
      </div>

      {/* Tip igračke */}
      <div>
        <label className={labelClass}>Tip igračke</label>
        <div className="flex flex-col gap-2">
          {TOY_TYPES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input
                type="checkbox"
                checked={filters.tip.includes(value)}
                onChange={() => toggleTip(value)}
                className="accent-sage-500 w-4 h-4 rounded"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Uzrast */}
      <div>
        <label className={labelClass}>Uzrast</label>
        <select
          className={inputClass}
          value={filters.uzrast}
          onChange={(e) => set('uzrast', e.target.value)}
        >
          {UZRAST_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Ciljna grupa */}
      <div>
        <label className={labelClass}>Ciljna grupa</label>
        <div className="flex flex-col gap-2">
          {CILJNA_GRUPA_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input
                type="radio"
                name="ciljnaGrupa"
                checked={filters.ciljnaGrupa === value}
                onChange={() => set('ciljnaGrupa', value)}
                className="accent-sage-500 w-4 h-4"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Datum proizvodnje */}
      <div>
        <label className={labelClass}>Datum proizvodnje</label>
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-xs text-gray-400 mb-1 block">Od</span>
            <input
              type="date"
              className={inputClass}
              value={filters.datumOd}
              onChange={(e) => set('datumOd', e.target.value)}
            />
          </div>
          <div>
            <span className="text-xs text-gray-400 mb-1 block">Do</span>
            <input
              type="date"
              className={inputClass}
              value={filters.datumDo}
              onChange={(e) => set('datumDo', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Cena */}
      <div>
        <label className={labelClass}>Cena (RSD)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className={inputClass}
            placeholder="Min"
            min={0}
            max={filters.cenaMax}
            value={filters.cenaMin}
            onChange={(e) => set('cenaMin', Math.max(0, Number(e.target.value)))}
          />
          <span className="text-gray-400 shrink-0">–</span>
          <input
            type="number"
            className={inputClass}
            placeholder="Max"
            min={filters.cenaMin}
            max={6000}
            value={filters.cenaMax}
            onChange={(e) => set('cenaMax', Math.min(6000, Number(e.target.value)))}
          />
        </div>
      </div>

      {/* Minimalna ocena */}
      <div>
        <label className={labelClass}>Minimalna ocena</label>
        <div className="flex items-center gap-0.5 text-amber-400 text-2xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => set('ocenaMin', filters.ocenaMin === star ? 0 : star)}
              className="hover:text-amber-500 transition-colors leading-none"
              title={`${star} i više`}
            >
              {star <= filters.ocenaMin ? '★' : '☆'}
            </button>
          ))}
          {filters.ocenaMin > 0 && (
            <span className="text-xs text-gray-400 ml-1 self-center">i više</span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SearchFilters;
