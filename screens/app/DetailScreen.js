import React from 'react';
import { View, StyleSheet, ScrollView, Image, FlatList, Alert, Linking, Platform } from 'react-native';
import { Button, Card, Title, Paragraph, Text, ActivityIndicator } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { getEventById, addPhotoToEvent } from '../../database/database';

export default function DetailScreen({ route }) {
  const { eventId } = route.params;
  const [event, setEvent] = React.useState(null);

  const loadEventDetails = React.useCallback(async () => {
    const data = await getEventById(eventId);
    setEvent(data);
  }, [eventId]);

  useFocusEffect(loadEventDetails);

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus.status !== 'granted' || mediaLibraryStatus.status !== 'granted') {
      Alert.alert("Permissão necessária", "É necessário permitir o acesso à câmera e à galeria.");
      return false;
    }
    return true;
  };

  const handleAddPhoto = () => {
    Alert.alert("Adicionar Foto", "Escolha de onde você quer adicionar a foto:",
      [
        { text: "Tirar Foto", onPress: async () => {
            if (!(await requestPermissions())) return;
            let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.5 });
            if (!result.canceled) savePhoto(result.assets[0].uri);
        }},
        { text: "Escolher da Galeria", onPress: async () => {
            if (!(await requestPermissions())) return;
            let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.5 });
            if (!result.canceled) savePhoto(result.assets[0].uri);
        }},
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const savePhoto = async (uri) => {
    await addPhotoToEvent(eventId, uri);
    loadEventDetails(); // Recarrega os detalhes para mostrar a nova foto
  };
  
  const openInMaps = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${event.latitude},${event.longitude}`;
    const label = event.title;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    Linking.openURL(url);
  };

  if (!event) return <ActivityIndicator style={{flex: 1}} animating={true} />;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: event.image }} />
        <Card.Content style={styles.content}>
          <Title style={styles.title}>{event.title}</Title>
          <Paragraph style={styles.date}>{new Date(event.date).toLocaleString('pt-BR')}</Paragraph>
          <Paragraph style={styles.description}>{event.description}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
            <Title>Galeria</Title>
            <FlatList
                data={event.photos}
                renderItem={({ item }) => <Image source={{ uri: item }} style={styles.photo} />}
                keyExtractor={(item, index) => index.toString()}
                horizontal showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma foto adicionada.</Text>}
                contentContainerStyle={{ paddingVertical: 10 }}
            />
            <Button icon="camera" mode="contained" onPress={handleAddPhoto} style={{marginTop: 10}}>Adicionar Foto</Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Localização</Title>
           <Paragraph>{event.location}</Paragraph>
        </Card.Content>
        <MapView style={styles.map} initialRegion={{ latitude: event.latitude, longitude: event.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}>
          <Marker coordinate={{ latitude: event.latitude, longitude: event.longitude }} title={event.title} />
        </MapView>
        <Card.Actions>
            <Button icon="map-marker-path" onPress={openInMaps}>Abrir no Mapa</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { margin: 16, marginTop: 0, marginBottom: 16 },
  content: { paddingTop: 16 },
  title: {fontWeight: 'bold'},
  date: {marginBottom: 10, color: 'gray'},
  description: { fontSize: 16, lineHeight: 24, marginVertical: 8 },
  photo: { width: 100, height: 100, borderRadius: 8, marginRight: 10, backgroundColor: '#eee' },
  map: { width: '100%', height: 250, marginTop: 10 },
  emptyText: { fontStyle: 'italic', color: 'gray' }
});