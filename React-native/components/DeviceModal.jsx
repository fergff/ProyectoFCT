import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../conexion/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeviceModal = ({ device, modalVisible, onClose }) => {
  // Inicializa el estado del LED basado en el prop 'device', pero será actualizado en tiempo real desde Firebase.
  const [ledState, setLedState] = useState(device?.SensorLed);

  useEffect(() => {
    const fetchLedState = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!device) {
            console.log("El dispositivo no está definido.");
            return;
        }
        if (!storedUserId) {
          console.log("No se pudo obtener el userId de AsyncStorage");
          return;
        }

        // Referencia específica para el estado del LED del dispositivo actual en Firebase.
        const ledRef = ref(database, `usuarios/${storedUserId}/devices/${device.id}/SensorLed`);

        // Escucha cambios en el estado del LED en Firebase y actualiza el estado local.
        const unsubscribe = onValue(ledRef, (snapshot) => {
          const currentLedState = snapshot.val();
          setLedState(currentLedState);
        });

        // Limpia la suscripción al desmontar el componente.  
        return () => unsubscribe();
      } catch (error) {
        console.error("Error al obtener el estado del LED desde Firebase:", error);
      }
    };

    fetchLedState();
  }, [device]);

  const toggleLed = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        throw new Error("No se pudo obtener el userId de AsyncStorage");
      }

      const newLedState = !ledState;
      const deviceRef = ref(database, `usuarios/${storedUserId}/devices/${device.id}`);

      // Actualiza directamente el estado del LED en Firebase.
      await update(deviceRef, { SensorLed: newLedState });
    } catch (error) {
      console.error("Error al cambiar el estado del LED:", error);
    }
  };

  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={onClose}
    >
    <View style={styles.Container}>
        {device && (
        <View>
            <Text style={styles.titulo}>{device.id}</Text>
            <View style={styles.linea} />
            <View style={styles.contenido}>
                
                <Text style={styles.texto}>Humedad Aire: {device.SensorHum == null ? "Nada" : device.SensorHum } %</Text>
                <Text style={styles.texto}>Temperatura: {device.Sensortemp == null ? "Nada" : device.Sensortemp} ºC</Text>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: ledState ? '#ff0000' : '#00ff00' }]}
                    onPress={toggleLed}
                    >
                    <Text style={styles.buttonText}>{ledState ? 'Apagar LED' : 'Encender LED'}</Text>
                    </TouchableOpacity>
            </View>
        </View>
        )}
        <View style={styles.abajo}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
        </View>
    </View>
</Modal>
);
};

const styles = new StyleSheet.create({
    Container: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: '#FFF',
        
    },
    contenido:{
        paddingTop: 10,
        paddingHorizontal:10,
    },
    linea: {
        borderBottomColor: '#68A74D', // Color de la línea
        borderBottomWidth: 2, // Grosor de la línea
        alignSelf: 'stretch', // Hace que la línea se extienda en el ancho disponible
    },
    texto:{
        fontSize: 20,
    },
    titulo:{
        fontSize: 25,
        fontWeight: 'bold',
        textAlign:'center',
    },
    button: {
        backgroundColor: '#9CB987',
        borderRadius: 5,
        borderColor:'#68A74D',
        borderWidth:3,
        padding: 10,
        margin: 5,
        alignItems: 'center', // Centrar el contenido de la tarjeta
        shadowColor: "#000",
      },
    abajo:{
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 15, 
    },
  });

  export default DeviceModal;