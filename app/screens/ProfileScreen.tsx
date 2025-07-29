import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = () => {
    const user = {
        name: 'Dilakshan Kamalathasan',
        email: 'dilakshan@email.com',
        bio: 'Botany enthusiast 🌿 | AI + Nature 🌱 | Building MedBotanica.',
        avatar: 'https://i.pravatar.cc/300', // You can replace this with a user-uploaded URL
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Profile Picture */}
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    <TouchableOpacity style={styles.editIcon}>
                        <Icon name="camera" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* User Info */}
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
                <Text style={styles.bio}>{user.bio}</Text>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Icon name="pencil-outline" size={18} color="#fff" />
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.settingsButton]}>
                        <Icon name="settings-outline" size={18} color="#2E7D32" />
                        <Text style={[styles.buttonText, { color: '#2E7D32' }]}>Settings</Text>
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
