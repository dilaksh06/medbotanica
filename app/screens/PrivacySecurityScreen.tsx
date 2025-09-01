import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    StatusBar,
    Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const PrivacySecurityScreen = ({ navigation }) => {
    const [settings, setSettings] = useState({
        dataCollection: true,
        personalizedAds: false,
        analytics: true,
        crashReports: true,
        biometricAuth: false,
        autoBackup: true,
    });

    const toggleSetting = (setting) => {
        setSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: async () => {
                        // Implement account deletion logic
                        console.log('Account deletion requested');
                    }
                }
            ]
        );
    };

    const openPrivacyPolicy = () => {
        Linking.openURL('https://yourwebsite.com/privacy-policy');
    };

    const openTermsOfService = () => {
        Linking.openURL('https://yourwebsite.com/terms-of-service');
    };

    const PrivacySection = ({ title, children }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );

    const PrivacySwitch = ({ label, value, onValueChange, icon }) => (
        <View style={styles.switchRow}>
            <View style={styles.switchLabelContainer}>
                <Icon name={icon} size={20} color="#52796F" />
                <Text style={styles.switchLabel}>{label}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                thumbColor={value ? "#27AE60" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
        </View>
    );

    const PrivacyLink = ({ label, onPress, icon }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuItemLeft}>
                <Icon name={icon} size={20} color="#52796F" />
                <Text style={styles.menuItemText}>{label}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#95A5A6" />
        </TouchableOpacity>
    );

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
                    <Text style={styles.headerTitle}>Privacy & Security</Text>
                    <View style={styles.headerRight} />
                </View>

                {/* Data Collection */}
                <PrivacySection title="Data & Privacy">
                    <PrivacySwitch
                        label="Allow data collection"
                        value={settings.dataCollection}
                        onValueChange={() => toggleSetting('dataCollection')}
                        icon="analytics-outline"
                    />
                    <PrivacySwitch
                        label="Personalized advertisements"
                        value={settings.personalizedAds}
                        onValueChange={() => toggleSetting('personalizedAds')}
                        icon="megaphone-outline"
                    />
                    <PrivacySwitch
                        label="Usage analytics"
                        value={settings.analytics}
                        onValueChange={() => toggleSetting('analytics')}
                        icon="bar-chart-outline"
                    />
                    <PrivacySwitch
                        label="Crash reports"
                        value={settings.crashReports}
                        onValueChange={() => toggleSetting('crashReports')}
                        icon="bug-outline"
                    />
                </PrivacySection>

                {/* Security */}
                <PrivacySection title="Security">
                    <PrivacySwitch
                        label="Biometric authentication"
                        value={settings.biometricAuth}
                        onValueChange={() => toggleSetting('biometricAuth')}
                        icon="finger-print-outline"
                    />
                    <PrivacySwitch
                        label="Automatic backup"
                        value={settings.autoBackup}
                        onValueChange={() => toggleSetting('autoBackup')}
                        icon="cloud-upload-outline"
                    />
                    
                    <TouchableOpacity 
                        style={styles.securityButton}
                        onPress={() => navigation.navigate('ChangePassword')}
                    >
                        <View style={styles.securityButtonContent}>
                            <Icon name="key-outline" size={20} color="#1B4332" />
                            <Text style={styles.securityButtonText}>Change Password</Text>
                        </View>
                        <Icon name="chevron-forward" size={20} color="#95A5A6" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.securityButton}
                        onPress={() => navigation.navigate('TwoFactorAuth')}
                    >
                        <View style={styles.securityButtonContent}>
                            <Icon name="shield-checkmark-outline" size={20} color="#1B4332" />
                            <Text style={styles.securityButtonText}>Two-Factor Authentication</Text>
                        </View>
                        <Icon name="chevron-forward" size={20} color="#95A5A6" />
                    </TouchableOpacity>
                </PrivacySection>

                {/* Legal */}
                <PrivacySection title="Legal">
                    <PrivacyLink
                        label="Privacy Policy"
                        onPress={openPrivacyPolicy}
                        icon="document-text-outline"
                    />
                    <PrivacyLink
                        label="Terms of Service"
                        onPress={openTermsOfService}
                        icon="document-text-outline"
                    />
                    <PrivacyLink
                        label="Data Processing Agreement"
                        onPress={() => {}}
                        icon="document-text-outline"
                    />
                </PrivacySection>

                {/* Data Management */}
                <PrivacySection title="Data Management">
                    <TouchableOpacity 
                        style={styles.dataButton}
                        onPress={() => navigation.navigate('ExportData')}
                    >
                        <View style={styles.dataButtonContent}>
                            <Icon name="download-outline" size={20} color="#1B4332" />
                            <Text style={styles.dataButtonText}>Export My Data</Text>
                        </View>
                        <Icon name="chevron-forward" size={20} color="#95A5A6" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.dataButton}
                        onPress={() => navigation.navigate('ClearData')}
                    >
                        <View style={styles.dataButtonContent}>
                            <Icon name="trash-outline" size={20} color="#E74C3C" />
                            <Text style={[styles.dataButtonText, { color: '#E74C3C' }]}>
                                Clear All Data
                            </Text>
                        </View>
                        <Icon name="chevron-forward" size={20} color="#95A5A6" />
                    </TouchableOpacity>
                </PrivacySection>

                {/* Account Deletion */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity 
                        style={styles.deleteAccountButton}
                        onPress={handleDeleteAccount}
                    >
                        <Icon name="trash-outline" size={20} color="#E74C3C" />
                        <Text style={styles.deleteAccountText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>

                {/* App Version */}
                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>MedBotanica v1.0.0</Text>
                    <Text style={styles.versionSubtext}>Privacy & Security</Text>
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
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E8F5E8',
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
    securityButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8F5E8',
    },
    securityButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    securityButtonText: {
        fontSize: 16,
        color: '#1B4332',
    },
    dataButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8F5E8',
    },
    dataButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dataButtonText: {
        fontSize: 16,
        color: '#1B4332',
    },
    deleteAccountButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        backgroundColor: '#FBEAEA',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F5C2C2',
    },
    deleteAccountText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E74C3C',
    },
    versionContainer: {
        alignItems: 'center',
        marginBottom: 20,
        padding: 16,
    },
    versionText: {
        fontSize: 14,
        color: '#95A5A6',
        marginBottom: 4,
    },
    versionSubtext: {
        fontSize: 12,
        color: '#95A5A6',
    },
});

export default PrivacySecurityScreen;