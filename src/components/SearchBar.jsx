import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="flex items-center gap-2.5 bg-white rounded-full shadow-lg px-4 py-2.5">
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
    );
};

export default SearchBar;
