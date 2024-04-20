import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../conexion/firebaseConfig';

const MainScreen = () => {
  const [temperatura, setTemperatura] = useState('');
  const [humedad, setHumedad] = useState('');
  const [ledState, setLedState] = useState(false); // Estado inicial del LED

  useEffect(() => {
    const userId = 'user01';
    const deviceId = 'device01';
    const tempRef = ref(database, `usuarios/${userId}/devices/${deviceId}/Sensortemp`);
    const humRef = ref(database, `usuarios/${userId}/devices/${deviceId}/SensorHum`);
    const ledRef = ref(database, `usuarios/${userId}/devices/${deviceId}/SensorLed`);

    const onTempChange = onValue(tempRef, (snapshot) => {
      setTemperatura(snapshot.val() || 'N/A');
    });

    const onHumChange = onValue(humRef, (snapshot) => {
      setHumedad(snapshot.val() || 'N/A');
    });

    const onLedChange = onValue(ledRef, (snapshot) => {
      setLedState(snapshot.val());
    });

    return () => {
      ledRef.off('value', onLedChange);
    };
  }, []);

  const toggleLed = () => {
    const userId = 'user01';
    const deviceId = 'device01';
    const newPath = `usuarios/${userId}/devices/${deviceId}/SensorLed`;
    set(ref(database, newPath), !ledState);
  };

  return (
    <View style={styles.container}>
      <Text>Temperatura: {temperatura}°C</Text>
      <Text>Humedad: {humedad}%</Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: ledState ? '#ff0000' : '#00ff00' }]}
        onPress={toggleLed}
      >
        <Text style={styles.buttonText}>{ledState ? 'Apagar LED' : 'Encender LED'}</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
export default MainScreen;