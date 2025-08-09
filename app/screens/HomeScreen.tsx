import React, { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    ScrollView,
    StatusBar,
} from 'react-native';
import {
    Asset,
    launchCamera,
    launchImageLibrary
} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const options = {
        mediaType: 'photo' as const,
        quality: 1 as const, // 1 means highest quality
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

    const handleIdentifyPlant = async () => {
        if (selectedImage) {
            setIsAnalyzing(true);
            console.log('Identifying plant from:', selectedImage.uri);
            // TODO: Add model inference logic here
            
            // Simulate analysis delay
            setTimeout(() => {
                setIsAnalyzing(false);
                // Navigate to results screen or show results modal
            }, 3000);
        } else {
            Alert.alert('No Image Selected', 'Please select or capture an image first.');
        }
    };

    const resetSelection = () => {
        setSelectedImage(null);
        setIsAnalyzing(false);
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#1B4332" />
            <SafeAreaView style={styles.container}>
                <LinearGradient
                    colors={['#1B4332', '#2D5A41', '#40916C']}
                    style={styles.headerGradient}
                >
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoEmoji}>🌿</Text>
                            <Text style={styles.logoText}>MedBotanica</Text>
                        </View>
                        <Text style={styles.subtitle}>AI-Powered Herbal Plant Identification</Text>
                    </View>
                </LinearGradient>

                <ScrollView 
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Image Upload Section */}
                    <View style={styles.uploadSection}>
                        <Text style={styles.sectionTitle}>Upload Plant Image</Text>
                        <Text style={styles.sectionSubtitle}>
                            Take a clear photo or select from gallery
                        </Text>

                        <View style={styles.uploadArea}>
                            {selectedImage ? (
                                <View style={styles.imageContainer}>
                                    <Image 
                                        source={{ uri: selectedImage.uri }} 
                                        style={styles.imagePreview} 
                                    />
                                    <TouchableOpacity 
                                        style={styles.removeButton}
                                        onPress={resetSelection}
                                    >
                                        <Text style={styles.removeButtonText}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.placeholderContainer}>
                                    <Text style={styles.placeholderIcon}>📸</Text>
                                    <Text style={styles.placeholderText}>
                                        No image selected
                                    </Text>
                                    <Text style={styles.placeholderSubtext}>
                                        Choose an option below
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.galleryButton]} 
                                onPress={handleSelectFromGallery}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.buttonIcon}>🖼️</Text>
                                <Text style={styles.buttonText}>Gallery</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.actionButton, styles.cameraButton]} 
                                onPress={handleCaptureWithCamera}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.buttonIcon}>📷</Text>
                                <Text style={styles.buttonText}>Camera</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Analysis Section */}
                    <View style={styles.analysisSection}>
                        <TouchableOpacity 
                            style={[
                                styles.identifyButton, 
                                (!selectedImage || isAnalyzing) && styles.disabledButton
                            ]} 
                            onPress={handleIdentifyPlant}
                            disabled={!selectedImage || isAnalyzing}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={
                                    (!selectedImage || isAnalyzing) 
                                        ? ['#95A5A6', '#7F8C8D'] 
                                        : ['#27AE60', '#2ECC71']
                                }
                                style={styles.buttonGradient}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Text style={styles.analyzeIcon}>🔍</Text>
                                        <Text style={styles.identifyButtonText}>
                                            Analyzing Plant...
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <Text style={styles.analyzeIcon}>🌱</Text>
                                        <Text style={styles.identifyButtonText}>
                                            Identify Plant
                                        </Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Features Info */}
                    <View style={styles.featuresSection}>
                        <Text style={styles.featuresTitle}>What you'll get:</Text>
                        <View style={styles.featuresList}>
                            <FeatureItem 
                                icon="🏷️" 
                                text="Plant identification with scientific name"
                            />
                            <FeatureItem 
                                icon="💊" 
                                text="Medicinal properties and uses"
                            />
                            <FeatureItem 
                                icon="⚠️" 
                                text="Safety information and warnings"
                            />
                            <FeatureItem 
                                icon="📚" 
                                text="Historical and cultural significance"
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
    <View style={styles.featureItem}>
        <Text style={styles.featureIcon}>{icon}</Text>
        <Text style={styles.featureText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FDF9',
    },
    headerGradient: {
        paddingTop: 20,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        fontWeight: '400',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    uploadSection: {
        marginTop: 30,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#1B4332',
        marginBottom: 5,
    },
    sectionSubtitle: {
        fontSize: 15,
        color: '#52796F',
        marginBottom: 20,
    },
    uploadArea: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#E8F5E8',
    },
    imageContainer: {
        position: 'relative',
        alignItems: 'center',
    },
    imagePreview: {
        width: width - 80,
        height: (width - 80) * 0.8,
        borderRadius: 15,
        resizeMode: 'cover',
    },
    removeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    placeholderContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    placeholderIcon: {
        fontSize: 60,
        marginBottom: 15,
        opacity: 0.6,
    },
    placeholderText: {
        fontSize: 18,
        color: '#52796F',
        fontWeight: '500',
        marginBottom: 5,
    },
    placeholderSubtext: {
        fontSize: 14,
        color: '#84A98C',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
    },
    galleryButton: {
        borderColor: '#74C69D',
    },
    cameraButton: {
        borderColor: '#52B788',
    },
    buttonIcon: {
        fontSize: 24,
        marginBottom: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1B4332',
    },
    analysisSection: {
        marginBottom: 30,
    },
    identifyButton: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    disabledButton: {
        shadowOpacity: 0.1,
        elevation: 2,
    },
    buttonGradient: {
        paddingVertical: 18,
        paddingHorizontal: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    analyzeIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    identifyButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 18,
        letterSpacing: 0.5,
    },
    featuresSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E8F5E8',
    },
    featuresTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1B4332',
        marginBottom: 15,
    },
    featuresList: {
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureIcon: {
        fontSize: 18,
        marginRight: 12,
        width: 25,
    },
    featureText: {
        flex: 1,
        fontSize: 15,
        color: '#52796F',
        lineHeight: 22,
    },
});

export default HomeScreen;
