import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

export default function SignupScreen({ navigation }) {
    return (
        <SafeAreaView style={commonStyles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Sign Up</Text>
                <Text style={styles.subtitle}>Create your Servly account</Text>
                {/* TODO: Implement signup form */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.text.secondary,
        marginBottom: 32,
    },
});
