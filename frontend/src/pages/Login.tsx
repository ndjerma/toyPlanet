import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [greska, setGreska] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uspeh = login(email, lozinka);
    if (uspeh) {
      navigate(from, { replace: true });
    } else {
      setGreska('Pogrešan email ili lozinka.');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-sm border border-[#e5e0d8] p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Prijava</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#e5e0d8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lozinka</label>
            <input
              type="password"
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
              required
              className="w-full border border-[#e5e0d8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>
          {greska && <p className="text-red-500 text-sm">{greska}</p>}  //? ako je greska prazan string, ne prikazuje se nista, ako nije, onda prikazujemo samu gresku
          <button
            type="submit"
            className="w-full bg-sage-500 hover:bg-sage-700 text-white rounded-lg px-4 py-2 font-medium transition-colors"
          >
            Prijavi se
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Nemaš nalog?{' '}
          <Link to="/register" className="text-sage-700 font-medium hover:underline">
            Registruj se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
