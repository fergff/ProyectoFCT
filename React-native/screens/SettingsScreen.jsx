import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';

export default function SettingsScreen({ }) {

  const handleLogout = async () => {
    try {
      // Intenta eliminar el userId de AsyncStorage
      await AsyncStorage.removeItem('userId');
      // Si la operación es exitosa, reinicia la app
      await Updates.reloadAsync();
    } catch (error) {
      // Si hay un error, puedes manejarlo aquí
      console.error('Failed to log out:', error);
    }
  };

  return (
    <View style={styles.sContainer}>
      <Text style={{ color: 'black', fontSize: 30, paddingBottom: 20 }}>Cuenta</Text>
      <View style={styles.linea} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.boton}>
          <Text style={styles.botonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    sContainer: {
        flex: 1,
        paddingTop: 5,
    },
    linea: {
        borderBottomColor: '#68A74D',
        borderBottomWidth: 2,
        alignSelf: 'stretch',
    },
    buttonContainer: {
      marginTop:15,
      alignItems: 'center',
      width: '100%',
      marginBottom: 15,
    },
    boton: {
      width: '80%',
      backgroundColor: '#ed0000',
      padding: 10,
      borderRadius: 5,
    },
    botonText: {
      fontSize: 22,
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
});
