import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Search } from 'lucide-react-native';
import { COLORS, getCategoryColor } from '../styles/colors';

const CATEGORIES = [
    { id: 'all', label: 'All Services' },
    { id: 'plumber', label: 'Plumber' },
    { id: 'electrician', label: 'Electrician' },
    { id: 'carpenter', label: 'Carpenter' },
    { id: 'painter', label: 'Painter' },
    { id: 'mechanic', label: 'Mechanic' },
    { id: 'cleaner', label: 'Cleaner' },
];

export default function SearchBar({ selectedCategory, onSelectCategory }) {
    return (
        <View style={styles.container}>
            {/* Search Input (Placeholder) */}
            <View style={styles.searchInput}>
                <Search size={20} color={COLORS.text.secondary} />
                <Text style={styles.searchPlaceholder}>Search services...</Text>
            </View>

            {/* Category Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoriesContainer}
                contentContainerStyle={styles.categoriesContent}
            >
                {CATEGORIES.map((category) => {
                    const isSelected = selectedCategory === category.id;
                    return (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryChip,
                                isSelected && {
                                    backgroundColor: getCategoryColor(category.id),
                                },
                            ]}
                            onPress={() => onSelectCategory(category.id)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    isSelected && styles.categoryTextSelected,
                                ]}
                            >
                                {category.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
    },
    searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 12,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchPlaceholder: {
        marginLeft: 12,
        fontSize: 16,
        color: COLORS.text.secondary,
    },
    categoriesContainer: {
        flexGrow: 0,
    },
    categoriesContent: {
        paddingRight: 16,
    },
    categoryChip: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text.primary,
    },
    categoryTextSelected: {
        color: COLORS.text.white,
    },
});
