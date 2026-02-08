import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: COLORS.text.white,
        fontSize: 16,
        fontWeight: '600',
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: COLORS.text.primary,
    },
    inputFocused: {
        borderColor: COLORS.accent,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text.primary,
        marginBottom: 8,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: 4,
    },
    heading1: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    heading2: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    heading3: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    bodyText: {
        fontSize: 16,
        color: COLORS.text.primary,
    },
    smallText: {
        fontSize: 14,
        color: COLORS.text.secondary,
    },
    shadow: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 16,
    },
});
