// Category colors for map markers and UI
export const CATEGORY_COLORS = {
    plumber: '#3B82F6',      // Blue
    electrician: '#F59E0B',  // Amber
    carpenter: '#8B4513',    // Brown
    painter: '#10B981',      // Green
    mechanic: '#6B7280',     // Gray
    cleaner: '#A855F7',      // Purple
    all: '#2D2D2D'           // Dark gray
};

// App theme colors
export const COLORS = {
    primary: '#2D2D2D',
    secondary: '#4B5563',
    accent: '#3B82F6',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    text: {
        primary: '#1F2937',
        secondary: '#6B7280',
        light: '#9CA3AF',
        white: '#FFFFFF'
    },
    border: '#E5E7EB',
    shadow: '#000000'
};

// Get color for a specific category
export const getCategoryColor = (category) => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.all;
};
