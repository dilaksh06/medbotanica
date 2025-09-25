import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Switch,
    SafeAreaView,
    StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

interface User {
    id: string;
    name: string;
    email: string;
    bio?: string;
    phone?: string;
    notifications_enabled?: boolean;
    dark_mode?: boolean;
}

const SettingsScreen = ({ navigation }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        phone: '',
        notifications_enabled: true,
        dark_mode: false,
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            
            const response = await fetch(`${API_BASE_URL}/user/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    bio: userData.bio || '',
                    phone: userData.phone || '',
                    notifications_enabled: userData.notifications_enabled ?? true,
                    dark_mode: userData.dark_mode ?? false,
                });
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert('Error', 'Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            
            const response = await fetch(`${API_BASE_URL}/user/me`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                Alert.alert('Success', 'Profile updated successfully');
                navigation.goBack();
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#27AE60" />
                <Text style={styles.loadingText}>Loading settings...</Text>
            </View>
        );
    }

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
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={styles.headerRight} />
                </View>

                {/* Profile Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile Information</Text>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(text) => handleChange('name', text)}
                            placeholder="Enter your full name"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.email}
                            onChangeText={(text) => handleChange('email', text)}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.phone}
                            onChangeText={(text) => handleChange('phone', text)}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={formData.bio}
                            onChangeText={(text) => handleChange('bio', text)}
                            placeholder="Tell us about yourself"
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    
                    <View style={styles.switchGroup}>
                        <View style={styles.switchRow}>
                            <View style={styles.switchLabelContainer}>
                                <Icon name="notifications-outline" size={20} color="#52796F" />
                                <Text style={styles.switchLabel}>Enable Notifications</Text>
                            </View>
                            <Switch
                                value={formData.notifications_enabled}
                                onValueChange={(value) => handleChange('notifications_enabled', value)}
                                thumbColor={formData.notifications_enabled ? "#27AE60" : "#f4f3f4"}
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                            />
                        </View>

                        <View style={styles.switchRow}>
                            <View style={styles.switchLabelContainer}>
                                <Icon name="moon-outline" size={20} color="#52796F" />
                                <Text style={styles.switchLabel}>Dark Mode</Text>
                            </View>
                            <Switch
                                value={formData.dark_mode}
                                onValueChange={(value) => handleChange('dark_mode', value)}
                                thumbColor={formData.dark_mode ? "#27AE60" : "#f4f3f4"}
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                            />
                        </View>
                    </View>
                </View>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('ChangePassword')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Icon name="lock-closed-outline" size={20} color="#52796F" />
                            <Text style={styles.menuItemText}>Change Password</Text>
                        </View>
                        <Icon name="chevron-forward" size={20} color="#95A5A6" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('PrivacySecurity')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Icon name="shield-checkmark-outline" size={20} color="#52796F" />
                            <Text style={styles.menuItemText}>Privacy & Security</Text>
                        </View>
                        <Icon name="chevron-forward" size={20} color="#95A5A6" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('HelpSupport')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Icon name="help-circle-outline" size={20} color="#52796F" />
                            <Text style={styles.menuItemText}>Help & Support</Text>
                        </View>
                        <Icon name="chevron-forward" size={20} color="#95A5A6" />
                    </TouchableOpacity>
                </View>

                {/* Save Button */}
                <TouchableOpacity 
                    style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    <LinearGradient
                        colors={saving ? ['#95A5A6', '#7F8C8D'] : ['#27AE60', '#2ECC71']}
                        style={styles.saveButtonGradient}
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Icon name="save-outline" size={18} color="#fff" />
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                {/* App Version */}
                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>MedBotanica v1.0.0</Text>
                </View>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FDF9',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#52796F',
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
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E8F5E8',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1B4332',
        marginBottom: 16,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1B4332',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F8FDF9',
        borderWidth: 1,
        borderColor: '#E8F5E8',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1B4332',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    switchGroup: {
        gap: 16,
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    switchLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    switchLabel: {
        fontSize: 16,
        color: '#1B4332',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8F5E8',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: '#1B4332',
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
    versionContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    versionText: {
        fontSize: 14,
        color: '#95A5A6',
    },
});

export default SettingsScreen;