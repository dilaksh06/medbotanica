import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useRef } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    StatusBar,
    Dimensions,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/RootNavigator';
import theme from '../utils/theme';
import { API_BASE_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Uncomment when using AsyncStorage

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        user: {
            id: string;
            name: string;
            email: string;
        };
        token: string;
    };
}

interface ValidationErrors {
    email?: string;
    password?: string;
    general?: string;
}

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Create refs for inputs
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        // Clear previous errors
        setErrors({});
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Construct the full URL for the login endpoint
            const url = `${API_BASE_URL}/auth/login`;
            console.log("Attempting to log in to:", url);

            // Make the API call to the backend
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email.trim().toLowerCase(), 
                    password: password 
                }),
            });

            const responseData: LoginResponse = await response.json();

            if (!response.ok) {
                // Handle different error scenarios
                if (response.status === 400) {
                    // Validation errors from backend
                    if (responseData.message.includes('email')) {
                        setErrors({ email: responseData.message });
                    } else if (responseData.message.includes('password')) {
                        setErrors({ password: responseData.message });
                    } else {
                        setErrors({ general: responseData.message });
                    }
                } else if (response.status === 401) {
                    // Unauthorized - wrong credentials
                    setErrors({ general: 'Invalid email or password. Please try again.' });
                } else if (response.status === 404) {
                    // User not found
                    setErrors({ email: 'No account found with this email address' });
                } else if (response.status === 429) {
                    // Rate limiting
                    setErrors({ general: 'Too many login attempts. Please try again later.' });
                } else {
                    // Generic error
                    setErrors({ general: responseData.message || 'Login failed. Please try again.' });
                }
            } else {
                // Login was successful
                console.log("Login successful:", responseData);
                
                // Store authentication token
                if (responseData.data?.token) {
                    // TODO: Uncomment and use AsyncStorage to store the token
                    await AsyncStorage.setItem('authToken', responseData.data.token);
                    await AsyncStorage.setItem('userData', JSON.stringify(responseData.data.user));
                    console.log('Token stored:', responseData.data.token);
                }

                // Show success message
                Alert.alert(
                    'Welcome Back!',
                    `Hello ${responseData.data?.user?.name || 'there'}! Ready to explore nature's pharmacy?`,
                    [
                        { 
                            text: 'Continue', 
                            onPress: () => navigation.replace('MainTabs') 
                        }
                    ]
                );
            }
        } catch (error) {
            // Handle network or other unexpected errors
            console.error('Login failed:', error);
            
            if (error instanceof TypeError && error.message.includes('Network request failed')) {
                setErrors({ general: 'Network request failed. Check your connection and try again.' });
            } else if (error instanceof Error && error.message.includes('timeout')) {
                setErrors({ general: 'Request timed out. Please try again.' });
            } else {
                setErrors({ general: 'An unexpected error occurred. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            Alert.alert(
                'Email Required',
                'Please enter your email address first, then try again.',
                [{ text: 'OK' }]
            );
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert(
                'Invalid Email',
                'Please enter a valid email address.',
                [{ text: 'OK' }]
            );
            return;
        }

        Alert.alert(
            'Reset Password',
            `A password reset link will be sent to ${email}`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Send Link', 
                    onPress: async () => {
                        try {
                            // TODO: Implement actual forgot password API call
                            const url = `${API_BASE_URL}/auth/forgot-password`;
                            const response = await fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ email: email.trim().toLowerCase() }),
                            });

                            if (response.ok) {
                                Alert.alert(
                                    'Email Sent',
                                    'Check your inbox for password reset instructions.',
                                    [{ text: 'OK' }]
                                );
                            } else {
                                throw new Error('Failed to send reset email');
                            }
                        } catch (error) {
                            console.log('Forgot password (placeholder):', email);
                            // For now, show success message as placeholder
                            Alert.alert(
                                'Reset Link Sent',
                                'Check your email for password reset instructions.',
                                [{ text: 'OK' }]
                            );
                        }
                    }
                }
            ]
        );
    };

    const handleSocialLogin = async (provider: 'Google' | 'Apple') => {
        try {
            // TODO: Implement actual social authentication
            console.log(`Login with ${provider}`);
            
            // For now, show a placeholder alert
            Alert.alert(
                `${provider} Login`,
                `${provider} login will be implemented soon.`,
                [{ text: 'OK' }]
            );
            
            // Example implementation structure:
            // 1. Use appropriate social auth library (Google Sign-In, Apple Sign-In)
            // 2. Get social auth token
            // 3. Send token to your backend for verification
            // 4. Backend verifies token and returns app token
            // 5. Store token and navigate to main app
            
        } catch (error) {
            console.error(`${provider} login failed:`, error);
            Alert.alert('Authentication Error', `Failed to authenticate with ${provider}. Please try again.`);
        }
    };

    const focusNextInput = () => {
        if (passwordRef.current) {
            passwordRef.current.focus();
        }
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled={true}
        >
            <StatusBar barStyle="light-content" backgroundColor="#1B4332" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                nestedScrollEnabled={true}
                bounces={true}
            >
                {/* Header Section with Gradient */}
                <LinearGradient
                    colors={['#1B4332', '#2D5A41', '#40916C']}
                    style={styles.headerGradient}
                >
                    <View style={styles.headerContent}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoEmoji}>🌿</Text>
                            <Text style={styles.logoText}>MedBotanica</Text>
                        </View>
                        <Text style={styles.tagline}>Identify Nature's Healing</Text>
                        <Text style={styles.description}>
                            Discover the medicinal properties of plants with AI-powered identification
                        </Text>
                    </View>
                </LinearGradient>

                {/* Login Form */}
                <View style={styles.formContainer}>
                    <View style={styles.formCard}>
                        <Text style={styles.welcomeText}>Welcome Back</Text>
                        <Text style={styles.loginSubtext}>
                            Sign in to continue your botanical journey
                        </Text>

                        {/* Display general error message if it exists */}
                        {errors.general && (
                            <View style={styles.generalErrorContainer}>
                                <Icon name="alert-circle-outline" size={16} color={theme.colors.error} />
                                <Text style={styles.generalErrorText}>{errors.general}</Text>
                            </View>
                        )}

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <TouchableWithoutFeedback onPress={() => emailRef.current?.focus()}>
                                <View style={[
                                    styles.inputWrapper,
                                    emailFocused && styles.inputFocused,
                                    errors.email && styles.inputError
                                ]}>
                                    <Icon
                                        name="mail-outline"
                                        size={20}
                                        color={emailFocused ? theme.colors.primary : theme.colors.textTertiary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        ref={emailRef}
                                        style={styles.textInput}
                                        placeholder="Enter your email"
                                        placeholderTextColor={theme.colors.textTertiary}
                                        value={email}
                                        onChangeText={(text) => {
                                            setEmail(text);
                                            if (errors.email) {
                                                setErrors(prev => ({ ...prev, email: undefined }));
                                            }
                                        }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        textContentType="emailAddress"
                                        returnKeyType="next"
                                        onFocus={() => setEmailFocused(true)}
                                        onBlur={() => setEmailFocused(false)}
                                        onSubmitEditing={focusNextInput}
                                        enablesReturnKeyAutomatically={true}
                                        maxLength={100}
                                        editable={!isLoading}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TouchableWithoutFeedback onPress={() => passwordRef.current?.focus()}>
                                <View style={[
                                    styles.inputWrapper,
                                    passwordFocused && styles.inputFocused,
                                    errors.password && styles.inputError
                                ]}>
                                    <Icon
                                        name="lock-closed-outline"
                                        size={20}
                                        color={passwordFocused ? theme.colors.primary : theme.colors.textTertiary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        ref={passwordRef}
                                        style={[styles.textInput, { flex: 1 }]}
                                        placeholder="Enter your password"
                                        placeholderTextColor={theme.colors.textTertiary}
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            if (errors.password) {
                                                setErrors(prev => ({ ...prev, password: undefined }));
                                            }
                                        }}
                                        textContentType="password"
                                        returnKeyType="done"
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => setPasswordFocused(false)}
                                        onSubmitEditing={handleLogin}
                                        enablesReturnKeyAutomatically={true}
                                        maxLength={128}
                                        editable={!isLoading}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeButton}
                                        activeOpacity={0.7}
                                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                        disabled={isLoading}
                                    >
                                        <Icon
                                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                                            size={20}
                                            color={theme.colors.textTertiary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity
                            style={styles.forgotPasswordButton}
                            onPress={handleForgotPassword}
                            activeOpacity={0.7}
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                            disabled={isLoading}
                        >
                            <Text style={[
                                styles.forgotPasswordText,
                                isLoading && styles.linkDisabled
                            ]}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={isLoading ? ['#95A5A6', '#7F8C8D'] : ['#27AE60', '#2ECC71']}
                                style={styles.loginButtonGradient}
                            >
                                {isLoading ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="small" color="#fff" />
                                        <Text style={styles.loadingText}>Signing In...</Text>
                                    </View>
                                ) : (
                                    <>
                                        <Icon name="log-in-outline" size={20} color="#fff" />
                                        <Text style={styles.loginButtonText}>Sign In</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Login Options */}
                        <View style={styles.socialButtonsContainer}>
                            <TouchableOpacity 
                                style={[styles.socialButton, isLoading && styles.socialButtonDisabled]} 
                                onPress={() => handleSocialLogin('Google')}
                                activeOpacity={0.7}
                                disabled={isLoading}
                            >
                                <Icon name="logo-google" size={20} color="#DB4437" />
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.socialButton, isLoading && styles.socialButtonDisabled]} 
                                onPress={() => handleSocialLogin('Apple')}
                                activeOpacity={0.7}
                                disabled={isLoading}
                            >
                                <Icon name="logo-apple" size={20} color="#000" />
                                <Text style={styles.socialButtonText}>Apple</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Register Link */}
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Don't have an account? </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Register')}
                            activeOpacity={0.7}
                            disabled={isLoading}
                        >
                            <Text style={[
                                styles.registerLink,
                                isLoading && styles.linkDisabled
                            ]}>
                                Create Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FDF9',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: Platform.OS === 'ios' ? 30 : 50,
    },
    headerGradient: {
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    logoEmoji: {
        fontSize: 36,
        marginRight: 10,
    },
    logoText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#E8F5E8',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
    },
    loginSubtext: {
        fontSize: 15,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    generalErrorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F5',
        borderWidth: 1,
        borderColor: theme.colors.error,
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
    },
    generalErrorText: {
        color: theme.colors.error,
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FDF9',
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        minHeight: 56,
    },
    inputFocused: {
        borderColor: theme.colors.primary,
        backgroundColor: '#FFFFFF',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    inputIcon: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.textPrimary,
        paddingVertical: 16,
        paddingHorizontal: 0,
        height: 56,
        textAlignVertical: 'center',
    },
    eyeButton: {
        padding: 8,
        minWidth: 32,
        minHeight: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 12,
        color: theme.colors.error,
        marginTop: 4,
        marginLeft: 4,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginBottom: 24,
        padding: 8,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    linkDisabled: {
        opacity: 0.5,
    },
    loginButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
        marginBottom: 24,
    },
    loginButtonDisabled: {
        shadowOpacity: 0.1,
        elevation: 2,
        opacity: 0.7,
    },
    loginButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        gap: 8,
        minHeight: 52,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    loadingText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
    },
    dividerText: {
        fontSize: 14,
        color: theme.colors.textTertiary,
        paddingHorizontal: 16,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FDF9',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 8,
        minHeight: 44,
    },
    socialButtonDisabled: {
        opacity: 0.5,
    },
    socialButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.textPrimary,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    registerText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    registerLink: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '600',
    },
});