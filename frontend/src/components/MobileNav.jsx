
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiBookmark, FiUser, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function MobileNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-6 py-3 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        {/* Home */}
        <Link to="/" className="flex flex-col items-center group">
          <FiHome className={`w-5 h-5 transition-colors ${isActive('/') ? 'text-black' : 'text-gray-400 group-hover:text-black'}`} />
          <span className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${isActive('/') ? 'text-black' : 'text-gray-400'}`}>
            Home
          </span>
        </Link>

        {/* Search - For now simple link, could be a modal */}
        <Link to="/" className="flex flex-col items-center group">
          <FiSearch className={`w-5 h-5 transition-colors text-gray-400 group-hover:text-black`} />
          <span className={`text-[8px] font-bold uppercase tracking-widest mt-1 text-gray-400`}>
            Explore
          </span>
        </Link>

        {/* Bookmarks */}
        <Link to="/bookmarks" className="flex flex-col items-center group">
          <FiBookmark className={`w-5 h-5 transition-colors ${isActive('/bookmarks') ? 'text-black' : 'text-gray-400 group-hover:text-black'}`} />
          <span className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${isActive('/bookmarks') ? 'text-black' : 'text-gray-400'}`}>
            Saved
          </span>
        </Link>

        {/* Account */}
        <Link to={isAuthenticated ? "/settings" : "/login"} className="flex flex-col items-center group">
          <FiUser className={`w-5 h-5 transition-colors ${isActive('/settings') || isActive('/login') ? 'text-black' : 'text-gray-400 group-hover:text-black'}`} />
          <span className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${isActive('/settings') || isActive('/login') ? 'text-black' : 'text-gray-400'}`}>
            {isAuthenticated ? 'Account' : 'Sign In'}
          </span>
        </Link>
      </div>
    </nav>
  );
}
