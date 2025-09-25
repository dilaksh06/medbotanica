import React, { useState, useEffect } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar,
    Alert,
    Dimensions,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

const { width } = Dimensions.get('window');

interface User {
    id: string;
    name: string;
    email: string;
    profile_url?: string;
    role: string;
    created_at: string;
    bio?: string;
    plants_identified?: number;
    accuracy?: string;
    level?: string;
}

interface ProfileScreenProps {
    navigation: any;
}

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Fetch user data from backend
    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            // For demo purposes, using a placeholder
            
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
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert('Error', 'Failed to load profile data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchUserData();
        }, [])
    );

    const uploadProfileImage = async (imageUri: string) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('avatar', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'profile.jpg',
            });

            const token = await AsyncStorage.getItem('authToken');
            

            const response = await fetch(`${API_BASE_URL}/user/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (response.ok) {
                Alert.alert('Success', 'Profile picture updated successfully');
                fetchUserData(); // Refresh user data
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Failed to upload profile picture');
        } finally {
            setUploading(false);
        }
    };

    const handleImagePick = () => {
        Alert.alert(
            'Change Profile Picture',
            'How would you like to update your profile picture?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Camera', 
                    onPress: () => openCamera() 
                },
                { 
                    text: 'Gallery', 
                    onPress: () => openGallery() 
                }
            ],
            { cancelable: true }
        );
    };

    const openCamera = () => {
        const options = {
            mediaType: 'photo' as const,
            maxWidth: 512,
            maxHeight: 512,
            quality: 1,
        };

        launchCamera(options, response => {
            if (response.assets && response.assets.length > 0) {
                const imageUri = response.assets[0].uri;
                setAvatar(imageUri || null);
                if (imageUri) {
                    uploadProfileImage(imageUri);
                }
            }
        });
    };

    const openGallery = () => {
        const options = {
            mediaType: 'photo' as const,
            maxWidth: 512,
            maxHeight: 512,
            quality: 'high' as const,
        };

        launchImageLibrary(options, response => {
            if (response.assets && response.assets.length > 0) {
                const imageUri = response.assets[0].uri;
                setAvatar(imageUri || null);
                if (imageUri) {
                    uploadProfileImage(imageUri);
                }
            }
        });
    };

    const handleEditProfile = () => {
        navigation.navigate('Settings');
    };

    const handleSettings = () => {
        navigation.navigate('Settings');
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Logout', 
                    style: 'destructive', 
                    onPress: async () => {
                        await AsyncStorage.removeItem('authToken');
                        await AsyncStorage.removeItem('userData');
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                }
            ]
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
        });
    };

    const StatCard = ({ icon, value, label, color }: {
        icon: string;
        value: string | number;
        label: string;
        color: string;
    }) => (
        <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
                <Icon name={icon} size={20} color={color} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    const QuickActionItem = ({ icon, label, onPress }: {
        icon: string;
        label: string;
        onPress: () => void;
    }) => (
        <TouchableOpacity 
            style={styles.quickActionItem} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.quickActionIcon}>
                <Icon name={icon} size={24} color="#1B4332" />
            </View>
            <Text style={styles.quickActionLabel}>{label}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#27AE60" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#1B4332" />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={fetchUserData}
                            colors={['#27AE60']}
                            tintColor="#27AE60"
                        />
                    }
                >
                    {/* Header with Gradient */}
                    <LinearGradient
                        colors={['#1B4332', '#2D5A41', '#40916C']}
                        style={styles.headerGradient}
                    >
                        <View style={styles.headerContent}>
                            {/* Avatar Section */}
                            <View style={styles.avatarSection}>
                                <View style={styles.avatarContainer}>
                                    {uploading ? (
                                        <View style={[styles.avatar, styles.avatarLoading]}>
                                            <ActivityIndicator size="small" color="#fff" />
                                        </View>
                                    ) : (
                                        <Image
                                            source={
                                                avatar 
                                                    ? { uri: avatar } 
                                                    : user?.profile_url 
                                                        ? { uri: user.profile_url }
                                                        : require('../assets/profile.png')
                                            }
                                            style={styles.avatar}
                                        />
                                    )}
                                    <TouchableOpacity 
                                        style={styles.editAvatarButton} 
                                        onPress={handleImagePick}
                                        activeOpacity={0.8}
                                        disabled={uploading}
                                    >
                                        <Icon name="camera" size={18} color="#fff" />
                                    </TouchableOpacity>
                                </View>

                                {/* User Info */}
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{user?.name || 'User'}</Text>
                                    <Text style={styles.userEmail}>{user?.email || ''}</Text>
                                    <View style={styles.levelBadge}>
                                        <Icon name="leaf" size={14} color="#27AE60" />
                                        <Text style={styles.levelText}>
                                            {user?.level || 'Plant Explorer'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Stats Section */}
                    <View style={styles.statsSection}>
                        <View style={styles.statsContainer}>
                            <StatCard 
                                icon="leaf-outline"
                                value={user?.plants_identified || 0}
                                label="Plants Identified"
                                color="#27AE60"
                            />
                            <StatCard 
                                icon="checkmark-circle-outline"
                                value={user?.accuracy || '0%'}
                                label="Accuracy Rate"
                                color="#2ECC71"
                            />
                            <StatCard 
                                icon="calendar-outline"
                                value={user?.created_at ? formatDate(user.created_at) : 'N/A'}
                                label="Member Since"
                                color="#52B788"
                            />
                        </View>
                    </View>

                    {/* Bio Section */}
                    {user?.bio && (
                        <View style={styles.bioSection}>
                            <View style={styles.sectionCard}>
                                <Text style={styles.sectionTitle}>About</Text>
                                <Text style={styles.bioText}>
                                    {user.bio || 'No bio available'}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actionsSection}>
                        <TouchableOpacity 
                            style={styles.primaryButton} 
                            onPress={handleEditProfile}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#27AE60', '#2ECC71']}
                                style={styles.buttonGradient}
                            >
                                <Icon name="pencil-outline" size={18} color="#fff" />
                                <Text style={styles.primaryButtonText}>
                                    Edit Profile
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.secondaryButtonsRow}>
                            <TouchableOpacity 
                                style={styles.secondaryButton} 
                                onPress={handleSettings}
                                activeOpacity={0.8}
                            >
                                <Icon name="settings-outline" size={18} color="#1B4332" />
                                <Text style={styles.secondaryButtonText}>Settings</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.secondaryButton, styles.shareButton]} 
                                onPress={() => console.log('Share profile')}
                                activeOpacity={0.8}
                            >
                                <Icon name="share-outline" size={18} color="#1B4332" />
                                <Text style={styles.secondaryButtonText}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.quickActionsSection}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <View style={styles.quickActionsGrid}>
                            <QuickActionItem 
                                icon="library-outline"
                                label="My Collection"
                                onPress={() => navigation.navigate('Collection')}
                            />
                            <QuickActionItem 
                                icon="heart-outline"
                                label="Favorites"
                                onPress={() => navigation.navigate('Favorites')}
                            />
                            <QuickActionItem 
                                icon="download-outline"
                                label="Offline Data"
                                onPress={() => navigation.navigate('Offline')}
                            />
                            <QuickActionItem 
                                icon="help-circle-outline"
                                label="Help & FAQ"
                                onPress={() => navigation.navigate('Help')}
                            />
                        </View>
                    </View>

                    {/* Logout Button */}
                    <View style={styles.logoutSection}>
                        <TouchableOpacity 
                            style={styles.logoutButton} 
                            onPress={handleLogout}
                            activeOpacity={0.8}
                        >
                            <Icon name="log-out-outline" size={18} color="#E74C3C" />
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FDF9',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    headerGradient: {
        paddingTop: 20,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        paddingHorizontal: 20,
    },
    avatarSection: {
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    avatarLoading: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#95A5A6',
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#27AE60',
        borderRadius: 18,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    userInfo: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 10,
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    levelText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
        marginLeft: 4,
    },
    statsSection: {
        marginTop: -20,
        paddingHorizontal: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E8F5E8',
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1B4332',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#52796F',
        textAlign: 'center',
        lineHeight: 16,
    },
    bioSection: {
        paddingHorizontal: 20,
        marginTop: 25,
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
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
        marginBottom: 12,
    },
    bioText: {
        fontSize: 15,
        color: '#52796F',
        lineHeight: 22,
    },
    actionsSection: {
        paddingHorizontal: 20,
        marginTop: 25,
    },
    primaryButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        gap: 8,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    secondaryButtonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderWidth: 1,
        borderColor: '#E8F5E8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    shareButton: {
        backgroundColor: '#F8FDF9',
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1B4332',
    },
    quickActionsSection: {
        paddingHorizontal: 20,
        marginTop: 25,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 12,
    },
    quickActionItem: {
        width: (width - 56) / 2,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8F5E8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F8FDF9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#1B4332',
        textAlign: 'center',
    },
    logoutSection: {
        paddingHorizontal: 20,
        marginTop: 30,
    },
    logoutButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#FBEAEA',
    },
    logoutButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#E74C3C',
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
});

export default ProfileScreen;