import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    SafeAreaView,
    StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

const ChangePasswordScreen = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateForm = () => {
        if (!currentPassword) {
            Alert.alert('Error', 'Current password is required');
            return false;
        }
        
        if (!newPassword) {
            Alert.alert('Error', 'New password is required');
            return false;
        }
        
        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters');
            return false;
        }
        
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }
        
        return true;
    };

    const handleChangePassword = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // const token = await AsyncStorage.getItem('authToken');
            const token = 'demo-token';

            const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Password changed successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                throw new Error(data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            Alert.alert('Error', error.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Icon name="arrow-back" size={24} color="#1B4332" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Change Password</Text>
                    <View style={styles.headerRight} />
                </View>

                {/* Instructions */}
                <View style={styles.instructionsContainer}>
                    <Icon name="lock-closed-outline" size={24} color="#52796F" />
                    <Text style={styles.instructionsText}>
                        For security, your new password should be at least 6 characters long.
                    </Text>
                </View>

                {/* Current Password */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Current Password</Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="Enter your current password"
                            secureTextEntry={!showCurrentPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                            style={styles.eyeButton}
                        >
                            <Icon
                                name={showCurrentPassword ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color="#95A5A6"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* New Password */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>New Password</Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="Enter your new password"
                            secureTextEntry={!showNewPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setShowNewPassword(!showNewPassword)}
                            style={styles.eyeButton}
                        >
                            <Icon
                                name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color="#95A5A6"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Confirm Password */}
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Confirm New Password</Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm your new password"
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={styles.eyeButton}
                        >
                            <Icon
                                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color="#95A5A6"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Requirements */}
                <View style={styles.requirementsContainer}>
                    <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                    <View style={styles.requirementItem}>
                        <Icon
                            name={newPassword.length >= 6 ? "checkmark-circle" : "ellipse-outline"}
                            size={16}
                            color={newPassword.length >= 6 ? "#27AE60" : "#95A5A6"}
                        />
                        <Text style={styles.requirementText}>At least 6 characters</Text>
                    </View>
                    <View style={styles.requirementItem}>
                        <Icon
                            name={newPassword === confirmPassword && newPassword ? "checkmark-circle" : "ellipse-outline"}
                            size={16}
                            color={newPassword === confirmPassword && newPassword ? "#27AE60" : "#95A5A6"}
                        />
                        <Text style={styles.requirementText}>Passwords match</Text>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity 
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                    onPress={handleChangePassword}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={loading ? ['#95A5A6', '#7F8C8D'] : ['#27AE60', '#2ECC71']}
                        style={styles.saveButtonGradient}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Icon name="key-outline" size={18} color="#fff" />
                                <Text style={styles.saveButtonText}>Change Password</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                {/* Forgot Password */}
                <TouchableOpacity 
                    style={styles.forgotPasswordButton}
                    onPress={() => navigation.navigate('ForgotPassword')}
                >
                    <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FDF9',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1B4332',
    },
    headerRight: {
        width: 40,
    },
    instructionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        gap: 12,
    },
    instructionsText: {
        flex: 1,
        fontSize: 14,
        color: '#52796F',
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1B4332',
        marginBottom: 8,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FDF9',
        borderWidth: 1,
        borderColor: '#E8F5E8',
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    passwordInput: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        color: '#1B4332',
    },
    eyeButton: {
        padding: 8,
    },
    requirementsContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E8F5E8',
    },
    requirementsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1B4332',
        marginBottom: 12,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    requirementText: {
        fontSize: 14,
        color: '#52796F',
    },
    saveButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        gap: 8,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    forgotPasswordButton: {
        alignItems: 'center',
        padding: 16,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#27AE60',
        fontWeight: '500',
    },
});

export default ChangePasswordScreen;