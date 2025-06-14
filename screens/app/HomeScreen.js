import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, FAB, ActivityIndicator, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getAllEvents } from '../../database/database';
import EventCard from '../../components/EventCard';

export default function HomeScreen({ navigation }) {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const loadEvents = async () => {
        try {
          setLoading(true);
          const data = await getAllEvents();
          setEvents(data);
        } catch (error) {
          console.error("Erro ao carregar eventos:", error);
        } finally {
          setLoading(false);
        }
      };
      loadEvents();
    }, [])
  );

  if (loading) {
      return <ActivityIndicator style={{flex: 1}} size="large" />
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Expo Go" subtitle="Eventos Locais" />
      </Appbar.Header>
      <FlatList
        data={events}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum evento cadastrado ainda.</Text>}
        renderItem={({ item }) => (
          <EventCard event={item} onPress={() => navigation.navigate('Details', { eventId: item.id })} />
        )}
        contentContainerStyle={styles.list}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddEvent')}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, paddingBottom: 80 },
  emptyText: { textAlign: 'center', marginTop: 20, fontStyle: 'italic', color: '#white' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 }
});