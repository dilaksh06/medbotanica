import React, { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {
    Asset,
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';

const HomeScreen = () => {
    const [selectedImage, setSelectedImage] = useState<Asset | null>(null);

    const options = {
        mediaType: 'photo',
        quality: 1,
    };

    const handleSelectFromGallery = async () => {
        const result = await launchImageLibrary(options);
        if (!result.didCancel && result.assets && result.assets.length > 0) {
            setSelectedImage(result.assets[0]);
        }
    };

    const handleCaptureWithCamera = async () => {
        const result = await launchCamera(options);
        if (!result.didCancel && result.assets && result.assets.length > 0) {
            setSelectedImage(result.assets[0]);
        }
    };

    const handleIdentifyPlant = () => {
        if (selectedImage) {
            console.log('Identifying plant from:', selectedImage.uri);
            // TODO: Add model inference logic here
        } else {
            Alert.alert('No Image Selected', 'Please select or capture an image first.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>🌿 Welcome to MedBotanica 🌿</Text>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.selectButton} onPress={handleSelectFromGallery}>
                    <Text style={styles.selectButtonText}>Pick from Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cameraButton} onPress={handleCaptureWithCamera}>
                    <Text style={styles.selectButtonText}>Use Camera</Text>
                </TouchableOpacity>
            </View>

            {selectedImage && (
                <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
            )}

            <TouchableOpacity style={styles.identifyButton} onPress={handleIdentifyPlant}>
                <Text style={styles.identifyButtonText}>Identify Plant</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F2FDF2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#2E7D32',
        marginBottom: 30,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
    },
    selectButton: {
        backgroundColor: '#81C784',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        flex: 1,
        marginRight: 8,
    },
    cameraButton: {
        backgroundColor: '#66BB6A',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        flex: 1,
        marginLeft: 8,
    },
    selectButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    imagePreview: {
        width: 250,
        height: 250,
        borderRadius: 12,
        marginBottom: 20,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: '#A5D6A7',
    },
    identifyButton: {
        backgroundColor: '#388E3C',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 10,
    },
    identifyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
