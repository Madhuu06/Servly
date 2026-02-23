import { Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/services';

const SearchBar = ({ selectedCategory, onSelectCategory, searchTerm, onSearchChange }) => {
    const navigate = useNavigate();
    const { userData } = useAuth();

    return (
        <div className="flex-shrink-0 z-[1000]">

            {/* ── Dark top bar ── */}
            <div className="flex items-center gap-4 px-5 py-3" style={{ backgroundColor: '#111827' }}>

                {/* Logo */}
                <span className="text-white font-bold text-lg tracking-tight flex-shrink-0 w-40">
                    Servly
                </span>

                {/* Centered search */}
                <div className="flex-1 flex items-center gap-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full px-4 py-2 transition max-w-2xl mx-auto">
                    <Search className="w-4 h-4 text-white/50 flex-shrink-0" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => onSearchChange(e.target.value)}
                        placeholder="Search services..."
                        className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/40"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="text-white/40 hover:text-white/70 text-xs transition"
                        >✕</button>
                    )}
                </div>

                {/* Profile */}
                <div className="w-40 flex justify-end">
                    <button
                        onClick={() => navigate('/profile')}
                        title={userData?.name || 'Profile'}
                        className="w-8 h-8 flex items-center justify-center rounded-full overflow-hidden transition hover:opacity-80"
                    >
                        {userData?.photoURL ? (
                            <img src={userData.photoURL} alt="" className="w-8 h-8 object-cover rounded-full" />
                        ) : (
                            <User className="w-5 h-5 text-white/60" />
                        )}
                    </button>
                </div>
            </div>

            {/* ── Category chips row ── */}
            <div className="flex items-center gap-1 px-5 py-2.5 bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide">
                {categories.map(cat => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.id)}
                            className={`px-3.5 py-1 rounded-full text-sm whitespace-nowrap flex-shrink-0 transition-all font-medium ${isSelected
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {cat.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchBar;
