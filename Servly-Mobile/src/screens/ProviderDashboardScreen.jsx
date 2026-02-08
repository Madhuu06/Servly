import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

export default function ProviderDashboardScreen() {
    const { userData } = useAuth();

    return (
        <SafeAreaView style={commonStyles.container}>
            <ScrollView style={styles.content}>
                <Text style={styles.title}>Provider Dashboard</Text>

                <View style={styles.statsCard}>
                    <Text style={styles.statsLabel}>Rating</Text>
                    <Text style={styles.statsValue}>
                        {userData?.rating?.toFixed(1) || '0.0'} ⭐
                    </Text>
                </View>

                <View style={styles.statsCard}>
                    <Text style={styles.statsLabel}>Total Reviews</Text>
                    <Text style={styles.statsValue}>{userData?.reviewCount || 0}</Text>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.label}>Category</Text>
                    <Text style={styles.value}>{userData?.category || 'N/A'}</Text>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.label}>Description</Text>
                    <Text style={styles.value}>{userData?.description || 'N/A'}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        marginBottom: 24,
    },
    statsCard: {
        backgroundColor: COLORS.accent,
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
    },
    statsLabel: {
        fontSize: 14,
        color: COLORS.text.white,
        marginBottom: 4,
    },
    statsValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text.white,
    },
    infoCard: {
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    label: {
        fontSize: 14,
        color: COLORS.text.secondary,
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: COLORS.text.primary,
        fontWeight: '500',
    },
});
