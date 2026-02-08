import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Linking, ScrollView } from 'react-native';
import { X, Phone, MessageCircle, MapPin, Star } from 'lucide-react-native';
import { COLORS, getCategoryColor } from '../styles/colors';

export default function ServiceBottomSheet({ service, onClose }) {
    if (!service) return null;

    const handleCall = () => {
        Linking.openURL(`tel:${service.phone}`);
    };

    const handleWhatsApp = () => {
        const message = `Hi, I found you on Servly. I need ${service.category} services.`;
        const phoneNumber = service.phone.replace(/[^0-9]/g, '');
        Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`);
    };

    return (
        <Modal
            visible={!!service}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    style={styles.bottomSheet}
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.dragHandle} />
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <X size={24} color={COLORS.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Category Badge */}
                        <View
                            style={[
                                styles.categoryBadge,
                                { backgroundColor: getCategoryColor(service.category) },
                            ]}
                        >
                            <Text style={styles.categoryText}>{service.category}</Text>
                        </View>

                        {/* Provider Name */}
                        <Text style={styles.providerName}>{service.name}</Text>

                        {/* Rating */}
                        <View style={styles.ratingContainer}>
                            <Star size={20} color="#F59E0B" fill="#F59E0B" />
                            <Text style={styles.ratingText}>
                                {service.rating?.toFixed(1) || '0.0'}
                            </Text>
                            <Text style={styles.reviewCount}>
                                ({service.reviewCount || 0} reviews)
                            </Text>
                            {service.isVerified && (
                                <View style={styles.verifiedBadge}>
                                    <Text style={styles.verifiedText}>✓ Verified</Text>
                                </View>
                            )}
                        </View>

                        {/* Description */}
                        {service.description && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>About</Text>
                                <Text style={styles.description}>{service.description}</Text>
                            </View>
                        )}

                        {/* Address */}
                        {service.address && (
                            <View style={styles.section}>
                                <View style={styles.addressContainer}>
                                    <MapPin size={18} color={COLORS.text.secondary} />
                                    <Text style={styles.addressText}>{service.address}</Text>
                                </View>
                                {service.distanceText && (
                                    <Text style={styles.distanceText}>
                                        {service.distanceText} away
                                    </Text>
                                )}
                            </View>
                        )}

                        {/* Contact Info */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Contact</Text>
                            <Text style={styles.phoneNumber}>{service.phone}</Text>
                        </View>
                    </ScrollView>

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.callButton]}
                            onPress={handleCall}
                        >
                            <Phone size={20} color={COLORS.text.white} />
                            <Text style={styles.actionButtonText}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.whatsappButton]}
                            onPress={handleWhatsApp}
                        >
                            <MessageCircle size={20} color={COLORS.text.white} />
                            <Text style={styles.actionButtonText}>WhatsApp</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        paddingBottom: 20,
    },
    header: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 8,
        position: 'relative',
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        top: 12,
        padding: 4,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.white,
        textTransform: 'capitalize',
    },
    providerName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        marginBottom: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 20,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    reviewCount: {
        fontSize: 14,
        color: COLORS.text.secondary,
    },
    verifiedBadge: {
        backgroundColor: '#10B981',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    verifiedText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text.white,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: 8,
    },
    description: {
        fontSize: 15,
        color: COLORS.text.secondary,
        lineHeight: 22,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 4,
    },
    addressText: {
        flex: 1,
        fontSize: 15,
        color: COLORS.text.secondary,
        lineHeight: 22,
    },
    distanceText: {
        fontSize: 14,
        color: COLORS.accent,
        marginLeft: 26,
    },
    phoneNumber: {
        fontSize: 16,
        color: COLORS.text.primary,
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 12,
    },
    callButton: {
        backgroundColor: COLORS.accent,
    },
    whatsappButton: {
        backgroundColor: '#25D366',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text.white,
    },
});
