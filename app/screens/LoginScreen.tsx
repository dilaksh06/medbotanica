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
    Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigation/RootNavigator';
import theme from '../utils/theme';

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    // Create refs for inputs
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // TODO: Replace with actual login validation
            navigation.replace('MainTabs');
        }, 1500);
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleForgotPassword = () => {
        Alert.alert(
            'Reset Password',
            'Password reset link will be sent to your email address.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Send Link', onPress: () => console.log('Reset password') }
            ]
        );
    };

    const focusNextInput = () => {
        if (passwordRef.current) {
            passwordRef.current.focus();
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1B4332" />
            
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                nestedScrollEnabled={true}
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

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <TouchableWithoutFeedback onPress={() => emailRef.current?.focus()}>
                                <View style={[
                                    styles.inputWrapper, 
                                    emailFocused && styles.inputFocused,
                                    email && !validateEmail(email) && styles.inputError
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
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        textContentType="emailAddress"
                                        returnKeyType="next"
                                        onFocus={() => setEmailFocused(true)}
                                        onBlur={() => setEmailFocused(false)}
                                        onSubmitEditing={focusNextInput}
                                        enablesReturnKeyAutomatically={true}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <TouchableWithoutFeedback onPress={() => passwordRef.current?.focus()}>
                                <View style={[
                                    styles.inputWrapper, 
                                    passwordFocused && styles.inputFocused
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
                                        onChangeText={setPassword}
                                        textContentType="password"
                                        returnKeyType="done"
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => setPasswordFocused(false)}
                                        onSubmitEditing={handleLogin}
                                        enablesReturnKeyAutomatically={true}
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
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity 
                            style={styles.forgotPasswordButton}
                            onPress={handleForgotPassword}
                            activeOpacity={0.7}
                            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        >
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
                                    <>
                                        <Text style={styles.loadingText}>Signing In...</Text>
                                    </>
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
                            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                                <Icon name="logo-google" size={20} color="#DB4437" />
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
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
                        >
                            <Text style={styles.registerLink}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
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
        paddingBottom: Platform.OS === 'ios' ? 50 : 100,
    },
    headerGradient: {
        paddingTop: 50,
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
    },
    loginButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        gap: 8,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
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