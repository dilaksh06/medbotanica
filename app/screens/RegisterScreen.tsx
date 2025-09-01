import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState, useRef } from 'react';
import {
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
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/RootNavigator';
import theme from '../utils/theme';
import { API_BASE_URL } from '../config/api';
 import AsyncStorage from '@react-native-async-storage/async-storage'; // Uncomment when using AsyncStorage

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

interface ValidationErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

interface ApiResponse {
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

export default function RegisterScreen({ navigation }: Props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Create refs for inputs
    const nameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const confirmPasswordRef = useRef<TextInput>(null);

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Full name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!validatePassword(password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        return hasUpperCase && hasLowerCase && hasNumbers;
    };

    const getPasswordStrength = (password: string): { strength: string; color: string; progress: number } => {
        if (!password) return { strength: '', color: '#E0E0E0', progress: 0 };
        
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score < 2) return { strength: 'Weak', color: '#E74C3C', progress: 0.2 };
        if (score < 4) return { strength: 'Medium', color: '#F39C12', progress: 0.6 };
        return { strength: 'Strong', color: '#27AE60', progress: 1 };
    };

    const handleRegister = async () => {
        // Clear previous errors
        setErrors({});
        
        if (!validateForm()) {
            return;
        }

        if (!acceptTerms) {
            Alert.alert('Terms & Conditions', 'Please accept the terms and conditions to continue');
            return;
        }

        setIsLoading(true);

        try {
            // Construct the full URL for the registration endpoint
            const url = `${API_BASE_URL}/auth/register`;
            console.log("Attempting to register to:", url);

            // Make the API call to the backend
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    password: password,
                }),
            });

            const responseData: ApiResponse = await response.json();

            if (!response.ok) {
                // Handle different error scenarios
                if (response.status === 400) {
                    // Validation errors from backend
                    if (responseData.message.includes('email')) {
                        setErrors({ email: responseData.message });
                    } else if (responseData.message.includes('password')) {
                        setErrors({ password: responseData.message });
                    } else if (responseData.message.includes('name')) {
                        setErrors({ name: responseData.message });
                    } else {
                        setErrors({ general: responseData.message });
                    }
                } else if (response.status === 409) {
                    // Email already exists
                    setErrors({ email: 'An account with this email already exists' });
                } else {
                    // Generic error
                    setErrors({ general: responseData.message || 'Registration failed. Please try again.' });
                }
            } else {
                // Registration was successful
                console.log("Registration successful:", responseData);
                
                // Store authentication token
                if (responseData.data?.token) {
                    // TODO: Uncomment and use AsyncStorage to store the token
                    // await AsyncStorage.setItem('authToken', responseData.data.token);
                    // await AsyncStorage.setItem('userData', JSON.stringify(responseData.data.user));
                    console.log('Token stored:', responseData.data.token);
                }

                Alert.alert(
                    'Registration Successful!',
                    `Welcome to MedBotanica, ${responseData.data?.user?.name || name}! Your botanical journey begins now.`,
                    [
                        { 
                            text: 'Get Started', 
                            onPress: () => navigation.replace('MainTabs') 
                        }
                    ]
                );
            }
        } catch (error) {
            // Handle network or other unexpected errors
            console.error('Registration failed:', error);
            
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

    const handleSocialRegister = async (provider: 'Google' | 'Apple') => {
        try {
            // TODO: Implement actual social authentication
            console.log(`Register with ${provider}`);
            
            // For now, show a placeholder alert
            Alert.alert(
                `${provider} Registration`,
                `${provider} registration will be implemented soon.`,
                [{ text: 'OK' }]
            );
            
            // Example implementation structure:
            // 1. Use appropriate social auth library (Google Sign-In, Apple Sign-In)
            // 2. Get social auth token
            // 3. Send token to your backend for verification
            // 4. Backend creates user account and returns app token
            // 5. Store token and navigate to main app
            
        } catch (error) {
            console.error(`${provider} registration failed:`, error);
            Alert.alert('Authentication Error', `Failed to authenticate with ${provider}. Please try again.`);
        }
    };

    const handleTermsPress = () => {
        // TODO: Navigate to Terms & Conditions screen or open web view
        Alert.alert(
            'Terms & Conditions',
            'Terms & Conditions and Privacy Policy screens will be implemented.',
            [{ text: 'OK' }]
        );
    };

    const handlePrivacyPress = () => {
        // TODO: Navigate to Privacy Policy screen or open web view
        Alert.alert(
            'Privacy Policy',
            'Privacy Policy screen will be implemented.',
            [{ text: 'OK' }]
        );
    };

    // Navigation between inputs
    const focusEmail = () => emailRef.current?.focus();
    const focusPassword = () => passwordRef.current?.focus();
    const focusConfirmPassword = () => confirmPasswordRef.current?.focus();

    const passwordStrength = getPasswordStrength(password);

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
                        <TouchableOpacity 
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
                            activeOpacity={0.7}
                        >
                            <Icon name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoEmoji}>🌿</Text>
                            <Text style={styles.logoText}>MedBotanica</Text>
                        </View>
                        <Text style={styles.tagline}>Create Your Healing Journey</Text>
                        <Text style={styles.description}>
                            Join thousands of plant enthusiasts discovering nature's pharmacy
                        </Text>
                    </View>
                </LinearGradient>

                {/* Registration Form */}
                <View style={styles.formContainer}>
                    <View style={styles.formCard}>
                        <Text style={styles.welcomeText}>Create Account</Text>
                        <Text style={styles.registerSubtext}>
                            Start your botanical adventure today
                        </Text>

                        {/* Display general error message if it exists */}
                        {errors.general && (
                            <View style={styles.generalErrorContainer}>
                                <Icon name="alert-circle-outline" size={16} color={theme.colors.error} />
                                <Text style={styles.generalErrorText}>{errors.general}</Text>
                            </View>
                        )}

                        {/* Full Name Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <TouchableWithoutFeedback onPress={() => nameRef.current?.focus()}>
                                <View style={[
                                    styles.inputWrapper, 
                                    focusedField === 'name' && styles.inputFocused,
                                    errors.name && styles.inputError
                                ]}>
                                    <Icon 
                                        name="person-outline" 
                                        size={20} 
                                        color={focusedField === 'name' ? theme.colors.primary : theme.colors.textTertiary} 
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        ref={nameRef}
                                        style={styles.textInput}
                                        placeholder="Enter your full name"
                                        placeholderTextColor={theme.colors.textTertiary}
                                        value={name}
                                        onChangeText={(text) => {
                                            setName(text);
                                            if (errors.name) {
                                                setErrors(prev => ({ ...prev, name: undefined }));
                                            }
                                        }}
                                        autoCapitalize="words"
                                        returnKeyType="next"
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        onSubmitEditing={focusEmail}
                                        enablesReturnKeyAutomatically={true}
                                        textContentType="name"
                                        maxLength={50}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <TouchableWithoutFeedback onPress={() => emailRef.current?.focus()}>
                                <View style={[
                                    styles.inputWrapper, 
                                    focusedField === 'email' && styles.inputFocused,
                                    errors.email && styles.inputError
                                ]}>
                                    <Icon 
                                        name="mail-outline" 
                                        size={20} 
                                        color={focusedField === 'email' ? theme.colors.primary : theme.colors.textTertiary} 
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
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        onSubmitEditing={focusPassword}
                                        enablesReturnKeyAutomatically={true}
                                        maxLength={100}
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
                                    focusedField === 'password' && styles.inputFocused,
                                    errors.password && styles.inputError
                                ]}>
                                    <Icon 
                                        name="lock-closed-outline" 
                                        size={20} 
                                        color={focusedField === 'password' ? theme.colors.primary : theme.colors.textTertiary} 
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        ref={passwordRef}
                                        style={[styles.textInput, { flex: 1 }]}
                                        placeholder="Create a strong password"
                                        placeholderTextColor={theme.colors.textTertiary}
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            if (errors.password) {
                                                setErrors(prev => ({ ...prev, password: undefined }));
                                            }
                                        }}
                                        textContentType="newPassword"
                                        returnKeyType="next"
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        onSubmitEditing={focusConfirmPassword}
                                        enablesReturnKeyAutomatically={true}
                                        maxLength={128}
                                    />
                                    <TouchableOpacity 
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeButton}
                                        activeOpacity={0.7}
                                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                    >
                                        <Icon 
                                            name={showPassword ? "eye-outline" : "eye-off-outline"} 
                                            size={20} 
                                            color={theme.colors.textTertiary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                            
                            {/* Password Strength Indicator */}
                            {password && (
                                <View style={styles.passwordStrengthContainer}>
                                    <View style={styles.passwordStrengthBar}>
                                        <View 
                                            style={[
                                                styles.passwordStrengthFill,
                                                { 
                                                    width: `${passwordStrength.progress * 100}%`,
                                                    backgroundColor: passwordStrength.color 
                                                }
                                            ]} 
                                        />
                                    </View>
                                    <Text style={[styles.passwordStrengthText, { color: passwordStrength.color }]}>
                                        {passwordStrength.strength}
                                    </Text>
                                </View>
                            )}
                            
                            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Confirm Password</Text>
                            <TouchableWithoutFeedback onPress={() => confirmPasswordRef.current?.focus()}>
                                <View style={[
                                    styles.inputWrapper, 
                                    focusedField === 'confirmPassword' && styles.inputFocused,
                                    errors.confirmPassword && styles.inputError
                                ]}>
                                    <Icon 
                                        name="checkmark-circle-outline" 
                                        size={20} 
                                        color={focusedField === 'confirmPassword' ? theme.colors.primary : theme.colors.textTertiary} 
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        ref={confirmPasswordRef}
                                        style={[styles.textInput, { flex: 1 }]}
                                        placeholder="Confirm your password"
                                        placeholderTextColor={theme.colors.textTertiary}
                                        secureTextEntry={!showConfirmPassword}
                                        value={confirmPassword}
                                        onChangeText={(text) => {
                                            setConfirmPassword(text);
                                            if (errors.confirmPassword) {
                                                setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                                            }
                                        }}
                                        textContentType="newPassword"
                                        returnKeyType="done"
                                        onFocus={() => setFocusedField('confirmPassword')}
                                        onBlur={() => setFocusedField(null)}
                                        onSubmitEditing={handleRegister}
                                        enablesReturnKeyAutomatically={true}
                                        maxLength={128}
                                    />
                                    <TouchableOpacity 
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={styles.eyeButton}
                                        activeOpacity={0.7}
                                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                    >
                                        <Icon 
                                            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                                            size={20} 
                                            color={theme.colors.textTertiary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                        </View>

                        {/* Terms & Conditions Checkbox */}
                        <TouchableOpacity 
                            style={styles.checkboxContainer}
                            onPress={() => setAcceptTerms(!acceptTerms)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                                {acceptTerms && <Icon name="checkmark" size={16} color="#fff" />}
                            </View>
                            <View style={styles.checkboxTextContainer}>
                                <Text style={styles.checkboxText}>
                                    I agree to the{' '}
                                    <Text style={styles.linkText} onPress={handleTermsPress}>
                                        Terms & Conditions
                                    </Text>
                                    {' '}and{' '}
                                    <Text style={styles.linkText} onPress={handlePrivacyPress}>
                                        Privacy Policy
                                    </Text>
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {/* Register Button */}
                        <TouchableOpacity 
                            style={[
                                styles.registerButton, 
                                isLoading && styles.registerButtonDisabled,
                                !acceptTerms && styles.registerButtonDisabled
                            ]} 
                            onPress={handleRegister}
                            disabled={isLoading || !acceptTerms}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={
                                    isLoading || !acceptTerms 
                                        ? ['#95A5A6', '#7F8C8D'] 
                                        : ['#27AE60', '#2ECC71']
                                }
                                style={styles.registerButtonGradient}
                            >
                                {isLoading ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="small" color="#fff" />
                                        <Text style={styles.loadingText}>Creating Account...</Text>
                                    </View>
                                ) : (
                                    <>
                                        <Icon name="person-add-outline" size={20} color="#fff" />
                                        <Text style={styles.registerButtonText}>Create Account</Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or continue with</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Registration Options */}
                        <View style={styles.socialButtonsContainer}>
                            <TouchableOpacity 
                                style={styles.socialButton}
                                onPress={() => handleSocialRegister('Google')}
                                activeOpacity={0.7}
                                disabled={isLoading}
                            >
                                <Icon name="logo-google" size={20} color="#DB4437" />
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.socialButton}
                                onPress={() => handleSocialRegister('Apple')}
                                activeOpacity={0.7}
                                disabled={isLoading}
                            >
                                <Icon name="logo-apple" size={20} color="#000" />
                                <Text style={styles.socialButtonText}>Apple</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity 
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                            disabled={isLoading}
                        >
                            <Text style={[
                                styles.loginLink,
                                isLoading && styles.linkDisabled
                            ]}>
                                Sign In
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
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        paddingHorizontal: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        padding: 8,
        marginBottom: 10,
        borderRadius: 20,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    logoEmoji: {
        fontSize: 32,
        marginRight: 8,
    },
    logoText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 6,
    },
    description: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 20,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 25,
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
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        textAlign: 'center',
        marginBottom: 6,
    },
    registerSubtext: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 20,
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
        marginBottom: 18,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        marginBottom: 6,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FDF9',
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 54,
        minHeight: 54,
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
        fontSize: 15,
        color: theme.colors.textPrimary,
        paddingVertical: 16,
        paddingHorizontal: 0,
        height: 54,
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
    passwordStrengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 8,
    },
    passwordStrengthBar: {
        flex: 1,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    passwordStrengthFill: {
        height: '100%',
        borderRadius: 2,
    },
    passwordStrengthText: {
        fontSize: 12,
        fontWeight: '500',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
        paddingHorizontal: 4,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderRadius: 4,
        marginRight: 12,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    checkboxTextContainer: {
        flex: 1,
    },
    checkboxText: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        lineHeight: 18,
    },
    linkText: {
        color: theme.colors.primary,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    linkDisabled: {
        opacity: 0.5,
    },
    registerButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
        marginBottom: 20,
    },
    registerButtonDisabled: {
        shadowOpacity: 0.1,
        elevation: 2,
        opacity: 0.7,
    },
    registerButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        gap: 8,
        minHeight: 52,
    },
    registerButtonText: {
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
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
    },
    dividerText: {
        fontSize: 12,
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
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 6,
        minHeight: 44,
    },
    socialButtonText: {
        fontSize: 13,
        fontWeight: '500',
        color: theme.colors.textPrimary,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    loginText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    loginLink: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '600',
    },
});