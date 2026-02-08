import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Star, Phone } from 'lucide-react-native';
import { COLORS, getCategoryColor } from '../styles/colors';

export default function ProviderList({ services, onSelectService }) {
    const renderProvider = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onSelectService(item)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <View
                        style={[
                            styles.categoryBadge,
                            { backgroundColor: getCategoryColor(item.category) },
                        ]}
                    >
                        <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                    {item.isVerified && (
                        <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedText}>✓ Verified</Text>
                        </View>
                    )}
                </View>
                {item.distanceText && (
                    <View style={styles.distanceContainer}>
                        <MapPin size={14} color={COLORS.text.secondary} />
                        <Text style={styles.distanceText}>{item.distanceText}</Text>
                    </View>
                )}
            </View>

            <Text style={styles.providerName}>{item.name}</Text>

            {item.description && (
                <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                </Text>
            )}

            <View style={styles.cardFooter}>
                <View style={styles.ratingContainer}>
                    <Star size={16} color="#F59E0B" fill="#F59E0B" />
                    <Text style={styles.ratingText}>
                        {item.rating?.toFixed(1) || '0.0'}
                    </Text>
                    <Text style={styles.reviewCount}>
                        ({item.reviewCount || 0} reviews)
                    </Text>
                </View>
                <View style={styles.phoneContainer}>
                    <Phone size={16} color={COLORS.accent} />
                    <Text style={styles.phoneText}>{item.phone}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Nearby Providers</Text>
                <Text style={styles.headerCount}>{services.length} found</Text>
            </View>
            <FlatList
                data={services}
                renderItem={renderProvider}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '40%',
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    headerCount: {
        fontSize: 14,
        color: COLORS.text.secondary,
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    categoryBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text.white,
        textTransform: 'capitalize',
    },
    verifiedBadge: {
        backgroundColor: '#10B981',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    verifiedText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.text.white,
    },
    distanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    distanceText: {
        fontSize: 12,
        color: COLORS.text.secondary,
    },
    providerName: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: COLORS.text.secondary,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    reviewCount: {
        fontSize: 12,
        color: COLORS.text.secondary,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    phoneText: {
        fontSize: 14,
        color: COLORS.accent,
        fontWeight: '500',
    },
});
