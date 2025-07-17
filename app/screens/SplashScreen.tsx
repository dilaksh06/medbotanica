// app/screens/SplashScreen.tsx

import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }: any) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Login'); // or your initial screen
        }, 4000); // delay in ms

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <ImageBackground
            source={require('../assets/splash_screen.png')}
            style={styles.background}
            resizeMode="cover" // or "contain" depending on image dimensions
        >
            {/* Optional overlay or logo can go here */}
        </ImageBackground>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});
