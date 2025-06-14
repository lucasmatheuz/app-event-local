import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { PaperProvider, ActivityIndicator, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { initDb, findUser } from './database/database';
import * as SecureStore from 'expo-secure-store';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    accent: '#03DAC6',
    background: '#1c1c1e',
    surface: '#000000',
    text: '#FFFFFF',
    placeholder: '#A9A9A9',
    onSurface: '#FFFFFF',
  },
};

const navigationTheme = {
    ...NavigationDarkTheme,
    colors: {
        ...NavigationDarkTheme.colors,
        background: darkTheme.colors.background,
        card: darkTheme.colors.surface,
        text: darkTheme.colors.text,
        primary: darkTheme.colors.primary,
    },
};

function AppContent() {
    const { isAuthenticated, login } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const setupApp = async () => {
            try {
                await initDb();
                const credsString = await SecureStore.getItemAsync('userCredentials');
                if (credsString) {
                    const creds = JSON.parse(credsString);
                    const user = await findUser(creds.email, creds.password);
                    if (user) {
                        login(user);
                    }
                }
            } catch (error) {
                console.error("Erro na inicialização do app:", error);
            } finally {
                setLoading(false);
            }
        };
        setupApp();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    
    return (
        <NavigationContainer theme={navigationTheme}>
            {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
}


export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PaperProvider theme={darkTheme}>
          <StatusBar barStyle="light-content" />
          <AppContent />
        </PaperProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}