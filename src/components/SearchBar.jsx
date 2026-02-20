import { Search, MapPin, Zap, Droplets, Wrench, Sparkles, Wind, LayoutGrid, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/services';

const iconMap = { Zap, Droplets, Wrench, Sparkles, Wind, LayoutGrid };

const SearchBar = ({ selectedCategory, onSelectCategory, searchTerm, onSearchChange }) => {
    const navigate = useNavigate();
    const { userData } = useAuth();

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="flex-shrink-0 z-[1000] bg-white shadow-sm">
            {/* ── Top bar ── */}
            <div className="flex items-center gap-3 px-5 py-3">

                {/* Logo */}
                <div className="flex items-center gap-2.5 flex-shrink-0 mr-1">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #FF8A00, #FF6B00)' }}>
                        <MapPin className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <span className="font-extrabold text-gray-900 text-lg tracking-tight leading-none block">Servly</span>
                        <span className="text-[10px] text-gray-400 leading-none">Find local services</span>
                    </div>
                </div>

                <div className="h-8 w-px bg-gray-100 flex-shrink-0 mx-1" />

                {/* Location pill */}
                <button className="flex items-center gap-1.5 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-full px-3 py-2 text-sm text-gray-700 transition-all flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#FF8A00' }} />
                    <span className="font-semibold text-xs">Near Me</span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {/* Search bar */}
                <div className="flex-1 max-w-xl flex items-center gap-2.5 bg-gray-50 border border-gray-200 focus-within:bg-white focus-within:border-orange-300 focus-within:shadow-[0_0_0_3px_rgba(255,138,0,0.1)] rounded-2xl px-4 py-2.5 transition-all">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by name, category, area..."
                        className="flex-1 outline-none text-sm text-gray-900 placeholder-gray-400 bg-transparent font-medium"
                    />
                    {searchTerm && (
                        <button onClick={() => onSearchChange('')}
                            className="w-5 h-5 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center text-gray-600 text-xs transition-colors flex-shrink-0">
                            ✕
                        </button>
                    )}
                </div>

                <div className="flex-1" />

                {/* Profile avatar — shows uploaded image if available */}
                <button
                    onClick={() => navigate('/profile')}
                    title={userData?.name || 'Profile'}
                    className="relative flex-shrink-0 group"
                >
                    {userData?.photoURL ? (
                        <img
                            src={userData.photoURL}
                            alt={userData?.name || 'Profile'}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-md group-hover:ring-orange-200 transition-all"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all"
                            style={{ background: 'linear-gradient(135deg, #1A1A1A, #404040)' }}>
                            {getInitials(userData?.name)}
                        </div>
                    )}
                    {/* Online dot */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                </button>
            </div>

            {/* ── Category chips ── */}
            <div className="flex items-center gap-1.5 px-5 pb-3 pt-1 overflow-x-auto scrollbar-hide">
                {categories.map((cat) => {
                    const Icon = iconMap[cat.icon];
                    const isSelected = selectedCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.id)}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all border ${isSelected
                                    ? 'text-white border-transparent shadow-sm'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50'
                                }`}
                            style={isSelected ? { background: 'linear-gradient(135deg, #FF8A00, #FF6B00)', borderColor: 'transparent' } : {}}
                        >
                            {Icon && <Icon className="w-3 h-3" />}
                            {cat.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchBar;
