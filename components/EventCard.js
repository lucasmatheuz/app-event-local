import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const EventCard = ({ event, onPress }) => {
    return (
        <Card style={styles.card} onPress={onPress}>
            <Card.Cover source={{ uri: event.image }} />
            <Card.Content style={styles.content}>
                <Title style={styles.title}>{event.title}</Title>
                <Paragraph style={styles.location}>{event.location}</Paragraph>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
    },
    content: {
        paddingTop: 12,
    },
    title: {
        fontWeight: 'bold',
        color: '#333'
    },
    location: {
        color: '#555'
    }
});

export default EventCard;