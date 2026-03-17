import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
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

const Profile = () => {
  const { user, updateUser } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <ProfileForm user={user} updateUser={updateUser} />;
};

type UserFields = {
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  adresa: string;
  lozinka: string;
  omiljeneVrste: ToyType[];
};

const ProfileForm = ({
  user,
  updateUser,
}: {
  user: UserFields & { id: string };
  updateUser: (data: Partial<UserFields>) => void;
}) => {
  const [forma, setForma] = useState<UserFields>({
    ime: user.ime,
    prezime: user.prezime,
    email: user.email,
    telefon: user.telefon,
    adresa: user.adresa,
    lozinka: user.lozinka,
    omiljeneVrste: user.omiljeneVrste,
  });

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
    e.preventDefault();
    updateUser(forma);
    toast.success('Profil je uspesno sacuvan.');
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="bg-white rounded-xl shadow-sm border border-[#e5e0d8] p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Moj profil</h1>
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
          <button
            type="submit"
            className="w-full bg-sage-500 hover:bg-sage-700 text-white rounded-lg px-4 py-2 font-medium transition-colors"
          >
            Sacuvaj izmene
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
