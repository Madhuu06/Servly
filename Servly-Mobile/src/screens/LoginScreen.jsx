import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

export default function LoginScreen({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const handleSendOTP = () => {
        // TODO: Implement OTP sending
        console.log('Sending OTP to:', phoneNumber);
        setOtpSent(true);
    };

    const handleVerifyOTP = () => {
        // TODO: Implement OTP verification
        console.log('Verifying OTP:', otp);
    };

    return (
        <SafeAreaView style={commonStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Welcome to Servly</Text>
                    <Text style={styles.subtitle}>
                        {otpSent ? 'Enter the OTP sent to your phone' : 'Login to continue'}
                    </Text>

                    {!otpSent ? (
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={commonStyles.label}>Phone Number</Text>
                                <TextInput
                                    style={commonStyles.input}
                                    placeholder="+91 1234567890"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <TouchableOpacity
                                style={[commonStyles.button, styles.button]}
                                onPress={handleSendOTP}
                            >
                                <Text style={commonStyles.buttonText}>Send OTP</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <View style={styles.inputContainer}>
                                <Text style={commonStyles.label}>OTP Code</Text>
                                <TextInput
                                    style={commonStyles.input}
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChangeText={setOtp}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                />
                            </View>

                            <TouchableOpacity
                                style={[commonStyles.button, styles.button]}
                                onPress={handleVerifyOTP}
                            >
                                <Text style={commonStyles.buttonText}>Verify OTP</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setOtpSent(false)}>
                                <Text style={styles.linkText}>Change phone number</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.linkText}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
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
    inputContainer: {
        marginBottom: 20,
    },
    button: {
        marginTop: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        fontSize: 14,
        color: COLORS.text.secondary,
    },
    linkText: {
        fontSize: 14,
        color: COLORS.accent,
        fontWeight: '600',
    },
});
