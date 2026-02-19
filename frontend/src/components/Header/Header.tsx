import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-[#e5e0d8]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-sage-700 hover:text-sage-800">
          🧸 ToyPlanet
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-sage-700 font-medium transition-colors">
            Home
          </Link>

          <Link to="/cart" className="relative text-gray-600 hover:text-sage-700 font-medium transition-colors">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-sage-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Auth section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-sage-700 font-medium transition-colors"
              >
                {user.ime} {user.prezime}
              </Link>
              <button
                onClick={handleLogout}
                className="border border-sage-500 text-sage-700 hover:bg-sage-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-sage-500 hover:bg-sage-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
