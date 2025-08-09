import React, { useState } from 'react';
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
    Dimensions
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const user = {
        name: 'Dilakshan Kamalathasan',
        email: 'dilakshan@email.com',
        bio: 'Botany enthusiast 🌿 | AI + Nature 🌱 | Building MedBotanica.',
        avatar: require('../assets/profile.png'), // fallback image
        joinedDate: 'March 2024',
        plantsIdentified: 147,
        accuracy: '94%',
        level: 'Expert Botanist'
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
                setAvatar(response.assets[0].uri || null);
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
                setAvatar(response.assets[0].uri || null);
            }
        });
    };

    const handleEditProfile = () => {
        setIsEditing(!isEditing);
        // Navigate to edit profile screen or show edit modal
    };

    const handleSettings = () => {
        // Navigate to settings screen
        console.log('Navigate to settings');
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout') }
            ]
        );
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#1B4332" />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
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
                                    <Image
                                        source={avatar ? { uri: avatar } : user.avatar}
                                        style={styles.avatar}
                                    />
                                    <TouchableOpacity 
                                        style={styles.editAvatarButton} 
                                        onPress={handleImagePick}
                                        activeOpacity={0.8}
                                    >
                                        <Icon name="camera" size={18} color="#fff" />
                                    </TouchableOpacity>
                                </View>

                                {/* User Info */}
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{user.name}</Text>
                                    <Text style={styles.userEmail}>{user.email}</Text>
                                    <View style={styles.levelBadge}>
                                        <Icon name="leaf" size={14} color="#27AE60" />
                                        <Text style={styles.levelText}>{user.level}</Text>
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
                                value={user.plantsIdentified}
                                label="Plants Identified"
                                color="#27AE60"
                            />
                            <StatCard 
                                icon="checkmark-circle-outline"
                                value={user.accuracy}
                                label="Accuracy Rate"
                                color="#2ECC71"
                            />
                            <StatCard 
                                icon="calendar-outline"
                                value={user.joinedDate}
                                label="Member Since"
                                color="#52B788"
                            />
                        </View>
                    </View>

                    {/* Bio Section */}
                    <View style={styles.bioSection}>
                        <View style={styles.sectionCard}>
                            <Text style={styles.sectionTitle}>About</Text>
                            <Text style={styles.bioText}>{user.bio}</Text>
                        </View>
                    </View>

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
                                    {isEditing ? 'Save Changes' : 'Edit Profile'}
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
                                onPress={() => console.log('My Collection')}
                            />
                            <QuickActionItem 
                                icon="heart-outline"
                                label="Favorites"
                                onPress={() => console.log('Favorites')}
                            />
                            <QuickActionItem 
                                icon="download-outline"
                                label="Offline Data"
                                onPress={() => console.log('Offline Data')}
                            />
                            <QuickActionItem 
                                icon="help-circle-outline"
                                label="Help & FAQ"
                                onPress={() => console.log('Help')}
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
});

export default ProfileScreen;