import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../conexion/firebaseConfig';
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
        <View style={{flex: 1,}}>
            <View style={styles.cartitle} >
                <Image source={require('../../assets/Icons/PottedPlant.png')} style={styles.logo} />
                <Text style={styles.titulo}>{device.id}</Text>
            </View>
            
            <View style={styles.contenido}>
                
                <Text style={styles.texto}>Humedad Aire: {device.SensorHum == null ? "Nada" : device.SensorHum } %</Text>
                <Text style={styles.texto}>Humedad Suelo: {device.SensorHumSuelo == null ? "Nada" : device.SensorHumSuelo} %</Text>
                <Text style={styles.texto}>Temperatura: {device.Sensortemp == null ? "Nada" : device.Sensortemp} ºC</Text>
                <Text style={styles.texto}>Estado: {ledState ? 'Encendido' : 'Apagado'}</Text>

                <View style={styles.abajo}>
                  <TouchableOpacity
                      style={[styles.button, { backgroundColor: ledState ? '#68A74D' : '#E53E3E' }]}
                      onPress={toggleLed}
                  >
                      <Text style={styles.buttonText}>{ledState ? 'Apagar' : 'Encender'}</Text>
                  </TouchableOpacity>
                </View>
            </View>
        </View>
        )}
    </View>
</Modal>
);
};

const styles = new StyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 5,
        backgroundColor: '#FFF',
        
    },
    cartitle:{
      backgroundColor:'#68A74D',
      flexDirection:'row',
      alignItems:'center',
      marginHorizontal:5,
      marginBottom:10,
      borderRadius:5,
    },
    contenido:{
      backgroundColor: '#FFF',
      padding: 20,
      margin:5,
      borderRadius: 5,
      borderColor: '#68A74D',
      borderWidth: 3,

      flex: 1,
      justifyContent: 'space-between'
    },
    texto:{
      fontSize: 22,
    },
    titulo:{
        paddingStart:10,
        fontSize: 25,
        color:'white',
        fontWeight: 'bold',
    },
    button: {
        borderRadius: 5,
        paddingVertical: 15,
        margin: 5,
        alignItems: 'center',
        shadowColor: "#000",
    },
    buttonText: {
      fontSize: 20,
      color:'white',
      fontWeight:'bold',
      fontStyle:'italic',
    },
    abajo:{
        flex: 1,
        justifyContent: 'flex-end',
    },
  });

  export default DeviceModal;