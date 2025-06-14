import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('expoGo.db');

export const initDb = async () => {
    await db.execAsync(`PRAGMA journal_mode = WAL;`);
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            profilePic TEXT
        );
    `);
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT NOT NULL,
            date TEXT NOT NULL,
            image TEXT,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            photos TEXT
        );
    `);
    console.log("Banco de dados e tabelas inicializados com sucesso!");
};

// Funções de Usuário
export const addUser = async (name, email, password) => {
    return await db.runAsync(
        'INSERT INTO users (name, email, password, profilePic) VALUES (?, ?, ?, ?)',
        [name, email, password, null]
    );
};

export const findUserByEmail = async (email) => {
    return await db.getFirstAsync('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
};

export const findUser = async (email, password) => {
     return await db.getFirstAsync(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email.toLowerCase(), password]
     );
};

export const updateUserProfilePic = async (userId, profilePicUri) => {
    return await db.runAsync(
        'UPDATE users SET profilePic = ? WHERE id = ?',
        [profilePicUri, userId]
    );
};

// Funções de Evento
export const addEvent = async (event) => {
    return await db.runAsync(
        'INSERT INTO events (title, location, description, date, image, latitude, longitude, photos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
            event.title, event.location, event.description, event.date,
            event.image, event.latitude, event.longitude, JSON.stringify(event.photos || [])
        ]
    );
};

export const getAllEvents = async () => {
    const allRows = await db.getAllAsync('SELECT * FROM events ORDER BY id DESC');
    return allRows.map(event => ({
        ...event,
        photos: JSON.parse(event.photos)
    }));
};

export const getEventById = async (id) => {
     const event = await db.getFirstAsync('SELECT * FROM events WHERE id = ?', [id]);
     if (event) {
        return { ...event, photos: JSON.parse(event.photos) };
     }
     return null;
};

export const addPhotoToEvent = async (eventId, photoUri) => {
    const event = await getEventById(eventId);
    if (!event) return;
    const updatedPhotos = [...event.photos, photoUri];
    return await db.runAsync(
        'UPDATE events SET photos = ? WHERE id = ?',
        [JSON.stringify(updatedPhotos), eventId]
    );
};