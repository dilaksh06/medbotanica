import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { RootStackParamList } from '../navigation/RootNavigator';
import theme from '../utils/theme'; // assuming theme is under utils

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // TODO: Validate login here
        navigation.replace('Home');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.inner}>
                <Text style={styles.title}>🌿 MedBotanica</Text>
                <Text style={styles.subtitle}>Identify Nature’s Healing</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
    },
    inner: {
        padding: theme.spacing.lg,
    },
    title: {
        fontSize: theme.typography.fontSize.header,
        fontWeight: 'bold',
        textAlign: 'center',
        color: theme.colors.primary,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: theme.typography.fontSize.medium,
        textAlign: 'center',
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
    },
    input: {
        height: 48,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.radius.md,
        paddingHorizontal: 12,
        backgroundColor: theme.colors.surface,
        marginBottom: theme.spacing.md,
        fontSize: theme.typography.fontSize.medium,
        color: theme.colors.textPrimary,
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 14,
        borderRadius: theme.radius.md,
        alignItems: 'center',
        marginTop: theme.spacing.sm,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: theme.typography.fontSize.medium,
        fontWeight: '600',
    },
});
