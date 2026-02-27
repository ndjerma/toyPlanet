import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ToyType } from '../types';

const SVE_VRSTE: { vrednost: ToyType; labela: string }[] = [
  { vrednost: 'slagalica', labela: 'Slagalica' },
  { vrednost: 'slikovnica', labela: 'Slikovnica' },
  { vrednost: 'figura', labela: 'Figura' },
  { vrednost: 'karakter', labela: 'Karakter' },
  { vrednost: 'edukativna', labela: 'Edukativna' },
  { vrednost: 'sportska', labela: 'Sportska' },
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [forma, setForma] = useState({
    ime: '',
    prezime: '',
    email: '',
    telefon: '',
    adresa: '',
    lozinka: '',
    omiljeneVrste: [] as ToyType[],
  });
  const [greska, setGreska] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForma((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleVrsta = (vrsta: ToyType) => {
    setForma((prev) => ({
      ...prev,
      omiljeneVrste: prev.omiljeneVrste.includes(vrsta)
        ? prev.omiljeneVrste.filter((v) => v !== vrsta)
        : [...prev.omiljeneVrste, vrsta],
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();   //? nemoj refresh stranice defaultno 
    if (forma.lozinka.length < 6) {
      setGreska('Lozinka mora imati najmanje 6 karaktera.');
      return;
    }
    const uspeh = register(forma);
    if (uspeh) {
      navigate('/');
    } else {
      setGreska('Korisnik sa ovim emailom vec postoji.');
    }
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="bg-white rounded-xl shadow-sm border border-[#e5e0d8] p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Registracija</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ime</label>
              <input
                type="text"
                name="ime"
                value={forma.ime}
                onChange={handleChange}
                required
                className="w-full border border-[#e5e0d8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prezime</label>
              <input
                type="text"
                name="prezime"
                value={forma.prezime}
                onChange={handleChange}
                required
                className="w-full border border-[#e5e0d8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={forma.email}
              onChange={handleChange}
              required
              className="w-full border border-[#e5e0d8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input
              type="text"
              name="telefon"
              value={forma.telefon}
              onChange={handleChange}
              required
              className="w-full border border-[#e5e0d8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresa</label>
            <input
              type="text"
              name="adresa"
              value={forma.adresa}
              onChange={handleChange}
              required
              className="w-full border border-[#e5e0d8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lozinka</label>
            <input
              type="password"
              name="lozinka"
              value={forma.lozinka}
              onChange={handleChange}
              required
              className="w-full border border-[#e5e0d8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Omiljene vrste igracaka
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SVE_VRSTE.map(({ vrednost, labela }) => (
                <label
                  key={vrednost}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={forma.omiljeneVrste.includes(vrednost)}
                    onChange={() => toggleVrsta(vrednost)}
                    className="accent-sage-500"
                  />
                  {labela}
                </label>
              ))}
            </div>
          </div>
          {greska && <p className="text-red-500 text-sm">{greska}</p>}
          <button
            type="submit"
            className="w-full bg-sage-500 hover:bg-sage-700 text-white rounded-lg px-4 py-2 font-medium transition-colors"
          >
            Registruj se
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Vec imas nalog?{' '}
          <Link to="/login" className="text-sage-700 font-medium hover:underline">
            Prijavi se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
