import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Appbar, Avatar, Text, Title, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import StyledButton from '../../components/StyledButton';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfilePic } from '../../database/database';

export default function ProfileScreen() {
    const { user, logout, updateUserPhoto } = useAuth();
    const theme = useTheme();

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permissão necessária", "É preciso permitir o acesso à galeria.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            const newPhotoUri = result.assets[0].uri;
            try {
                await updateUserProfilePic(user.id, newPhotoUri);
                updateUserPhoto(newPhotoUri); // Atualiza o estado global
            } catch (error) {
                console.error("Erro ao atualizar foto de perfil:", error);
                Alert.alert("Erro", "Não foi possível atualizar a foto de perfil.");
            }
        }
    };

    if (!user) {
        return null; // ou um loading spinner
    }

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Meu Perfil" />
            </Appbar.Header>
            <View style={styles.content}>
                <TouchableOpacity onPress={handlePickImage}>
                    {user.profilePic ? (
                        <Avatar.Image size={120} source={{ uri: user.profilePic }} style={styles.avatar} />
                    ) : (
                        <Avatar.Text size={120} label={user.name ? user.name.charAt(0).toUpperCase() : 'U'} style={styles.avatar} />
                    )}
                </TouchableOpacity>
                <Title style={styles.title}>{user.name}</Title>
                <Text style={styles.email}>{user.email}</Text>
                <StyledButton onPress={logout} style={styles.button}>
                    Sair (Logout)
                </StyledButton>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    avatar: { marginBottom: 16, backgroundColor: '#BB86FC' },
    title: { fontSize: 24, fontWeight: 'bold' },
    email: { fontSize: 16, color: '#A9A9A9' },
    button: { marginTop: 32, width: '80%' }
});