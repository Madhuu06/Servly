import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

export default function UserProfileScreen() {
    const { userData, logout } = useAuth();

    return (
        <SafeAreaView style={commonStyles.container}>
            <ScrollView style={styles.content}>
                <Text style={styles.title}>Profile</Text>

                <View style={styles.infoCard}>
                    <Text style={styles.label}>Name</Text>
                    <Text style={styles.value}>{userData?.name || 'N/A'}</Text>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.label}>Phone</Text>
                    <Text style={styles.value}>{userData?.phone || 'N/A'}</Text>
                </View>

                <TouchableOpacity
                    style={[commonStyles.button, styles.logoutButton]}
                    onPress={logout}
                >
                    <Text style={commonStyles.buttonText}>Logout</Text>
                </TouchableOpacity>
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
    logoutButton: {
        marginTop: 24,
        backgroundColor: COLORS.error,
    },
});
