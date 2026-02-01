import { Search, Zap, Droplets, Wrench, Sparkles, Wind, LayoutGrid } from 'lucide-react';
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
        <div className="absolute top-4 left-0 right-0 z-[1000] px-4 flex flex-col gap-3 pointer-events-none">
            {/* Search Input with Avatar */}
            <div className="bg-white rounded-full shadow-lg flex items-center px-4 py-3 pointer-events-auto">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                    type="text"
                    placeholder="What service do you need?"
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm sm:text-base"
                />
                {/* User Avatar Button */}
                <button
                    onClick={() => navigate('/profile')}
                    className="ml-3 flex-shrink-0"
                >
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                        <span className="text-sm font-bold text-white">
                            {getInitials(userData?.name)}
                        </span>
                    </div>
                </button>
            </div>

            {/* Category Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide pointer-events-auto -mx-4 px-4">
                {categories.map((cat) => {
                    const Icon = iconMap[cat.icon];
                    const isSelected = selectedCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.id)}
                            className={`
                        flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all shadow-sm
                        ${isSelected
                                    ? 'bg-primary text-white shadow-md scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'}
                    `}
                        >
                            {Icon && <Icon className="w-4 h-4" />}
                            {cat.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchBar;
