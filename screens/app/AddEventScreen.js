import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, FlatList } from 'react-native';
import { Card, List, Title, Text, Button, TextInput, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { addEvent } from '../../database/database';
import StyledButton from '../../components/StyledButton';
import StyledTextInput from '../../components/StyledTextInput';

export default function AddEventScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [addressQuery, setAddressQuery] = useState('');
    const [addressResults, setAddressResults] = useState([]);
    const [foundLocation, setFoundLocation] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const theme = useTheme();

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permissão necessária", "É preciso permitir o acesso à galeria para adicionar uma foto de capa.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.7,
        });

        if (!result.canceled) {
            setCoverImage(result.assets[0].uri);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            if (addressQuery.length > 3 && !foundLocation) {
                handleAddressSearch();
            } else if (addressQuery.length <= 3) {
                setAddressResults([]);
            }
        }, 1000);
        
        return () => clearTimeout(handler);
    }, [addressQuery, foundLocation]);
    
    const handleAddressSearch = async () => {
        setIsSearching(true);
        setAddressResults([]);
        try {
            const endpoint = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressQuery)}&format=json&limit=5`;
            const response = await fetch(endpoint);
            const data = await response.json();
            setAddressResults(data);
        } catch (error) {
            Alert.alert("Erro de Rede", "Não foi possível conectar à API de geocodificação.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectLocation = (item) => {
        setFoundLocation({
            address: item.display_name,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
        });
        setAddressQuery(item.display_name);
        setAddressResults([]);
    };

    const handleSave = async () => {
        if(!title || !description || !coverImage || !foundLocation) {
            Alert.alert("Erro", "Preencha todos os campos, incluindo endereço e foto de capa.");
            return;
        }
        const newEvent = {
            title, location: foundLocation.address, description,
            date: new Date().toISOString(), image: coverImage,
            latitude: foundLocation.latitude, longitude: foundLocation.longitude,
            photos: []
        };
        try {
            await addEvent(newEvent);
            Alert.alert("Sucesso", "Evento cadastrado!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar o evento.");
        }
    };

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
        >
            <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <Title style={styles.headerTitle}>Nova Foto de Capa</Title>
                <Card style={styles.card}>
                    <Card.Content>
                        {coverImage ? (
                            <Image source={{ uri: coverImage }} style={styles.coverImage} />
                        ) : (
                            <Text style={styles.placeholderText}>Nenhuma imagem selecionada</Text>
                        )}
                         <Button icon="image-plus" mode="outlined" onPress={handlePickImage} style={{marginTop: 10}}>
                             Escolher Foto de Capa
                         </Button>
                    </Card.Content>
                </Card>

                <StyledTextInput label="Título do Evento" value={title} onChangeText={setTitle} />
                <StyledTextInput label="Descrição" value={description} multiline onChangeText={setDescription} />
                
                <Title style={styles.locationTitle}>Localização do Evento</Title>
                <StyledTextInput
                    label="Buscar endereço..."
                    value={addressQuery}
                    onChangeText={(text) => { setAddressQuery(text); setFoundLocation(null); }}
                    right={isSearching ? <TextInput.Icon icon="clock" /> : null}
                />
                
                {addressResults.map((item) => (
                    <TouchableOpacity key={item.place_id} onPress={() => handleSelectLocation(item)}>
                        <List.Item
                            title={item.display_name}
                            style={[styles.listItem, {backgroundColor: theme.colors.surface}]}
                            titleStyle={{color: theme.colors.text}}
                            titleNumberOfLines={2}
                        />
                    </TouchableOpacity>
                ))}

                <StyledButton onPress={handleSave} style={styles.saveButton} disabled={!foundLocation}>Salvar Evento</StyledButton>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 50 },
    headerTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    card: { marginBottom: 20 },
    coverImage: { width: '100%', height: 180, borderRadius: 8 },
    placeholderText: { textAlign: 'center', paddingVertical: 60, color: 'gray' },
    locationTitle: { fontSize: 18, marginTop: 8, marginBottom: 8 },
    listItem: { marginBottom: 2, borderRadius: 4 },
    saveButton: { marginTop: 32 }
});