import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => {
    try {
        return <Image source={require('../assets/images/logo.png')} style={styles.logo} />;
    } catch (error) {
        return <Image source={{ uri: 'https://placehold.co/150x150/6200ee/FFFFFF?text=ExpoGo' }} style={styles.logo} />;
    }
};

const styles = StyleSheet.create({
    logo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 20,
    }
});

export { Logo };