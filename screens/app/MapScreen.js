import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Appbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getAllEvents } from '../../database/database';

export default function MapScreen({ navigation }) {
  const [events, setEvents] = React.useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadEvents = async () => {
        const data = await getAllEvents();
        setEvents(data);
      };
      loadEvents();
    }, [])
  );
  
  return (
    <View style={styles.container}>
      <Appbar.Header><Appbar.Content title="Mapa de Eventos" /></Appbar.Header>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: -22.405, longitude: -43.663,
          latitudeDelta: 0.04, longitudeDelta: 0.04,
        }}>
        {events.map(event => (
          <Marker
            key={event.id}
            coordinate={{ latitude: event.latitude, longitude: event.longitude }}
            title={event.title}
            description={event.location}
            onCalloutPress={() => navigation.navigate('Details', { eventId: event.id })}
          />
        ))}
      </MapView>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1 } });