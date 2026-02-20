import { Search, MapPin, Zap, Droplets, Wrench, Sparkles, Wind, LayoutGrid, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/services';

const iconMap = {
    Zap, Droplets, Wrench, Sparkles, Wind, LayoutGrid
};

const SearchBar = ({ selectedCategory, onSelectCategory, searchTerm, onSearchChange }) => {
    const navigate = useNavigate();
    const { userData } = useAuth();

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="flex-shrink-0 bg-white border-b border-gray-200 z-[1000]">
            {/* ── Top bar ── */}
            <div className="flex items-center gap-4 px-5 py-3">
                {/* Logo */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FF8A00' }}>
                        <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-gray-900 text-lg tracking-tight">Servly</span>
                </div>

                <div className="h-6 w-px bg-gray-200 flex-shrink-0" />

                {/* Location pill */}
                <button className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 text-sm text-gray-700 transition-colors flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5" style={{ color: '#FF8A00' }} />
                    <span className="font-medium">Near Me</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Search */}
                <div className="flex-1 max-w-lg flex items-center gap-2.5 bg-gray-100 border border-transparent focus-within:border-gray-300 focus-within:bg-white rounded-xl px-4 py-2.5 transition-all">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search providers by name or category..."
                        className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="flex-1" />

                {/* Avatar */}
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2.5 bg-gray-100 hover:bg-gray-200 rounded-full pl-2 pr-3 py-1.5 transition-colors flex-shrink-0"
                >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                        style={{ backgroundColor: '#1A1A1A' }}>
                        {getInitials(userData?.name)}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                        {userData?.name?.split(' ')[0] || 'Account'}
                    </span>
                </button>
            </div>

            {/* ── Category chips ── */}
            <div className="flex items-center gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
                {categories.map((cat) => {
                    const Icon = iconMap[cat.icon];
                    const isSelected = selectedCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.id)}
                            style={isSelected ? { backgroundColor: '#FF8A00', borderColor: '#FF8A00', color: '#fff' } : {}}
                            className={`
                                flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold
                                whitespace-nowrap flex-shrink-0 transition-all border
                                ${!isSelected ? 'bg-white text-gray-600 border-gray-200 hover:border-gray-400' : ''}
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
