import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from '../screens/HomeScreen';
import TiempoScreen from '../screens/TiempoScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { FontAwesome, Feather } from '@expo/vector-icons'; // Importa ambos iconos de Expo en una línea

const Tab = createMaterialTopTabNavigator();

export default function MyTabs({ onLogout }) {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: '#CDCDCD',
                tabBarStyle: {
                    backgroundColor: "#68A74D",
                    paddingTop: 30, // Reduce el padding vertical para que el menú ocupe menos espacio
                    padding: 5,
                },
                swipeEnabled: true,
                tabBarIndicatorStyle: { // Oculta el indicador de la pestaña
                    backgroundColor: 'white',
                },
                tabBarShowIcon: false, // Asegúrate de habilitar la visualización de iconos
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Tiempo"
                component={TiempoScreen}
                options={{
                    tabBarLabel: 'Tiempo',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="search" color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Cuenta"
                // Pasa la función onLogout a SettingsScreen
                children={() => <SettingsScreen onLogout={onLogout} />}
                options={{
                    tabBarLabel: 'Cuenta',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="settings" color={color} size={24} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}