import { Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/services';

const SearchBar = ({ selectedCategory, onSelectCategory, searchTerm, onSearchChange }) => {
    const navigate = useNavigate();
    const { userData } = useAuth();

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            {/* Top row: logo + search + profile */}
            <div className="flex items-center gap-3 px-4 py-3">

                {/* Logo */}
                <span className="text-gray-900 font-bold text-lg tracking-tight flex-shrink-0">
                    Servly
                </span>

                {/* Search */}
                <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-3.5 py-2 max-w-lg mx-auto">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => onSearchChange(e.target.value)}
                        placeholder="Search services..."
                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                    />
                    {searchTerm && (
                        <button onClick={() => onSearchChange('')}
                            className="text-gray-400 hover:text-gray-600 text-xs transition">✕</button>
                    )}
                </div>

                {/* Profile */}
                <button
                    onClick={() => navigate('/profile')}
                    title={userData?.name || 'Profile'}
                    className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 border border-gray-200 hover:border-gray-300 transition"
                >
                    {userData?.photoURL ? (
                        <img src={userData.photoURL} alt="" className="w-8 h-8 object-cover" />
                    ) : (
                        <User className="w-4 h-4 text-gray-400" />
                    )}
                </button>
            </div>

            {/* Category chips */}
            <div className="flex items-center gap-1 px-4 pb-3 overflow-x-auto scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`px-3 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0 transition-all font-medium ${selectedCategory === cat.id
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchBar;
