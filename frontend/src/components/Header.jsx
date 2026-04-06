import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiUser, FiHome, FiBookmark, FiLogOut, FiSearch, FiSun, FiCloud, FiCloudRain, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [weather, setWeather] = useState(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Fetch unique categories
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/articles/categories')
      .then((r) => r.json())
      .then((data) => setCategories(data.data || []))
      .catch((e) => console.error('Error fetching categories:', e));
  }, []);

  // Fetch Weather for Tangier
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=35.7595&longitude=-5.8340&current_weather=true')
      .then((r) => r.json())
      .then((data) => setWeather(data.current_weather))
      .catch((e) => console.error('Weather fetch error:', e));
  }, []);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch suggestions
  useEffect(() => {
    if (debouncedQuery.length > 1) {
      fetch(`http://127.0.0.1:8000/api/articles?search=${encodeURIComponent(debouncedQuery)}`)
        .then(r => r.json())
        .then(data => {
          setSuggestions((data.data || []).slice(0, 6));
          setIsDropdownOpen(true);
        });
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  }, [debouncedQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getWeatherIcon = (code) => {
    if (code === 0) return <FiSun className="text-yellow-500" />;
    if (code <= 3) return <FiCloud className="text-gray-400" />;
    if (code >= 51 && code <= 67) return <FiCloudRain className="text-blue-400" />;
    return <FiCloud className="text-gray-400" />;
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-black sticky top-0 z-50 shadow-sm">
      <div className="h-0.5 w-full bg-black"></div>
      <div className="container mx-auto px-4">
        {/* Top Header Layer: Brand | Search | Auth */}
        <div className="flex flex-col md:flex-row justify-between items-center py-5 gap-4">
          <Link to="/" className="group flex-shrink-0">
            <h1 className="text-3xl font-bold font-nyt-heading tracking-tight group-hover:opacity-75 transition-opacity leading-none">
              TangierTimes
            </h1>
            <p className="text-[9px] text-gray-400 italic tracking-[0.2em] font-bold uppercase mt-1">
              Morocco's English Daily
            </p>
          </Link>

          {/* Search Input - Hidden on mobile, shown in top section of mobile nav later */}
          <div className="relative w-full max-w-lg mx-auto md:block hidden" ref={searchRef}>
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search news, topics, or trends..."
              value={query}
              onFocus={() => query.length > 1 && setIsDropdownOpen(true)}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-sm transition-all text-sm outline-none"
            />
            
            {/* Search Dropdown */}
            {isDropdownOpen && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-lg border border-gray-100 z-50 overflow-hidden">
                <div className="py-2">
                  <div className="px-4 py-1.5 bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 flex justify-between">
                    <span>Quick Results</span>
                    <span>{suggestions.length} Found</span>
                  </div>
                  {suggestions.map((s) => (
                    <Link
                      key={s.id}
                      to={`/article/${s.id}`}
                      state={{ article: s }}
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setQuery('');
                      }}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group"
                    >
                      {s.image && (
                        <img src={s.image} alt="" className="w-10 h-10 object-cover rounded shadow-sm flex-shrink-0" />
                      )}
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-black">{s.title}</h4>
                        <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">{s.category || 'World'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-5 flex-shrink-0 md:flex hidden">
            <span className="text-[10px] text-gray-400 hidden xl:block font-bold uppercase tracking-widest">{today}</span>
            {isAuthenticated ? (
              <div className="relative group ml-5 pl-5 border-l border-gray-100">
                {/* Dropdown Trigger: User Profile */}
                <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-black cursor-pointer py-2">
                  <div className="w-7 h-7 bg-black text-white flex items-center justify-center rounded-full text-[10px] font-nyt-heading">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline">{user.name}</span>
                  <svg className="w-3 h-3 text-gray-400 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Dropdown Menu: Shows on Hover */}
                <div className="absolute right-0 top-full pt-1 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 z-50">
                  <div className="w-48 bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-sm py-2">
                    <div className="px-4 py-2 mb-1 border-b border-gray-50">
                      <p className="text-[9px] text-gray-400 uppercase tracking-[0.15em] mb-0.5">Signed in as</p>
                      <p className="text-[10px] font-black truncate">{user.email}</p>
                    </div>

                    <Link to="/bookmarks" className="flex items-center space-x-3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                      <FiBookmark className="w-3.5 h-3.5" />
                      <span>My Bookmarks</span>
                    </Link>

                    <Link to="/settings" className="flex items-center space-x-3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                      <FiSettings className="w-3.5 h-3.5" />
                      <span>Account Settings</span>
                    </Link>

                    <div className="my-1 border-t border-gray-50"></div>

                    <button 
                      onClick={logout}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-black hover:bg-black hover:text-white transition-all">
                <FiUser className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Bottom Nav: Dynamic Categories | Weather */}
        <nav className="border-t border-gray-100 flex items-center justify-between overflow-x-auto scrollbar-hide py-1">
          <div className="flex space-x-1">
            <Link
              to="/"
              className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all flex items-center ${
                isActive('/') ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              <FiHome className="mr-1.5 w-3.5 h-3.5" /> Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/category/${cat}`}
                className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                  isActive(`/category/${cat}`) ? 'text-black underline underline-offset-8 decoration-2' : 'text-gray-500 hover:text-black'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {weather && (
            <div className="hidden lg:flex items-center space-x-3 pl-6 border-l border-gray-100 ml-4 py-1">
              <div className="text-xl">
                {getWeatherIcon(weather.weathercode)}
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end space-x-1.5">
                  <span className="text-xs font-black tracking-tighter">{Math.round(weather.temperature)}°C</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Tangier</span>
                </div>
                <p className="text-[7px] font-black uppercase tracking-[0.1em] text-gray-300 -mt-0.5">Real-time Weather</p>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
