import { Search, Zap, Droplets, Wrench, Sparkles, Wind, LayoutGrid, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/services';

const iconMap = {
    Zap: Zap,
    Droplets: Droplets,
    Wrench: Wrench,
    Sparkles: Sparkles,
    Wind: Wind,
    LayoutGrid: LayoutGrid
};

const SearchBar = ({ selectedCategory, onSelectCategory }) => {
    const navigate = useNavigate();
    const { userData } = useAuth();

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="w-full bg-white border-b border-gray-200 shadow-sm z-[1000] flex-shrink-0">
            {/* Top Bar: Logo + Search + Avatar */}
            <div className="flex items-center gap-4 px-6 py-3">
                {/* Logo */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 bg-[#2D2D2D] rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-[#2D2D2D] tracking-tight">Servly</span>
                </div>

                {/* Search Input */}
                <div className="flex-1 max-w-xl bg-gray-100 rounded-full flex items-center px-4 py-2.5 gap-3">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="What service do you need?"
                        className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm"
                    />
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* User Avatar Button */}
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                            {getInitials(userData?.name)}
                        </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden xl:block">
                        {userData?.name || 'Profile'}
                    </span>
                </button>
            </div>

            {/* Category Chips Row */}
            <div className="flex gap-2 overflow-x-auto px-6 pb-3 scrollbar-hide">
                {categories.map((cat) => {
                    const Icon = iconMap[cat.icon];
                    const isSelected = selectedCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.id)}
                            className={`
                                flex items-center gap-2 px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-all border flex-shrink-0
                                ${isSelected
                                    ? 'bg-[#2D2D2D] text-white border-[#2D2D2D]'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'}
                            `}
                        >
                            {Icon && <Icon className="w-3.5 h-3.5" />}
                            {cat.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchBar;
