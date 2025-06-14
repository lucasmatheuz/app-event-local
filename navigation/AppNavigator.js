import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Telas Principais
import HomeScreen from '../screens/app/HomeScreen';
import MapScreen from '../screens/app/MapScreen';
import ProfileScreen from '../screens/app/ProfileScreen';

// Telas Secundárias
import DetailScreen from '../screens/app/DetailScreen';
import AddEventScreen from '../screens/app/AddEventScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6200ee',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker" color={color} size={size} />
          ),
        }}
      />
       <Tab.Screen
        name="ProfileTab"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={size} />
          ),
        }}
       >
         {props => <ProfileScreen {...props} onLogout={onLogout} />}
       </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function AppNavigator({ onLogout }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" options={{ headerShown: false }}>
        {props => <MainTabs {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen
        name="Details"
        component={DetailScreen}
        options={{ title: 'Detalhes do Evento' }}
      />
      <Stack.Screen
        name="AddEvent"
        component={AddEventScreen}
        options={{ title: 'Cadastrar Novo Evento' }}
      />
    </Stack.Navigator>
  );
}
