import React, { useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = () => {
    const [avatar, setAvatar] = useState<string | null>(null);

    const user = {
        name: 'Dilakshan Kamalathasan',
        email: 'dilakshan@email.com',
        bio: 'Botany enthusiast 🌿 | AI + Nature 🌱 | Building MedBotanica.',
        avatar: require('../assets/profile.png'), // fallback image
    };

    const handleImagePick = () => {
        // Choose between camera or gallery
        const options = {
            mediaType: 'photo',
            maxWidth: 512,
            maxHeight: 512,
            quality: 0.8,
        };

        // Ask user choice
        launchImageLibrary(options, response => {
            if (response.assets && response.assets.length > 0) {
                setAvatar(response.assets[0].uri || null);
            }
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <Image
                        source={
                            avatar ? { uri: avatar } : user.avatar
                        }
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.editIcon} onPress={handleImagePick}>
                        <Icon name="camera" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* User Info */}
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
                <Text style={styles.bio}>{user.bio}</Text>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Icon name="pencil-outline" size={18} color="#fff" />
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.settingsButton]}>
                        <Icon name="settings-outline" size={18} color="#2E7D32" />
                        <Text style={[styles.buttonText, { color: '#2E7D32' }]}>
                            Settings
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F2FDF2',
    },
    container: {
        padding: 24,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#A5D6A7',
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4CAF50',
        borderRadius: 16,
        padding: 6,
    },
    name: {
        fontSize: 22,
        fontWeight: '600',
        color: '#2E7D32',
        marginTop: 8,
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    bio: {
        fontSize: 14,
        color: '#444',
        textAlign: 'center',
        marginTop: 12,
        marginHorizontal: 10,
    },
    buttonContainer: {
        marginTop: 30,
        width: '100%',
        gap: 16,
    },
    button: {
        backgroundColor: '#388E3C',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    settingsButton: {
        backgroundColor: '#E8F5E9',
        borderWidth: 1,
        borderColor: '#A5D6A7',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
    },
});
