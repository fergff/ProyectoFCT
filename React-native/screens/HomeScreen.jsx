import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // para obtener iduser
import { ref, onValue, update, get } from 'firebase/database'; // Asegurarse de importar 'update'
import { database } from '../conexion/firebaseConfig';
import DeviceModal from './Modal/DeviceModal';

export default function HomeScreen() {
    const [devices, setDevices] = useState([]);
    const [userId, setUserId] = useState(''); // Estado para almacenar el userId
    const [modalVisible, setModalVisible] = useState(false); // Estado para modal
    const [selectedDevice, setSelectedDevice] = useState(null); // Estado para el dispositivo seleccionado

    const handlePressDevice = (device) => { // cuando toco un dispositivo de la lista
        setSelectedDevice(device); // Guardamos el objeto completo
        setModalVisible(true); // Abrimos la modal
    };

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId !== null) {
                    setUserId(storedUserId); // Actualiza el estado con el userId recuperado
                    const devicesRef = ref(database, `usuarios/${storedUserId}/devices`);

                    // Escucha cambios en la base de datos
                    onValue(devicesRef, (snapshot) => {
                        const devicesData = snapshot.val();
                        const devicesList = devicesData ? Object.keys(devicesData).map(key => ({
                            id: key,
                            ...devicesData[key]
                        })) : [];

                        // Filtra los dispositivos con connected: true
                        const connectedDevices = devicesList.filter(device => device.connected);
                        setDevices(connectedDevices); // Actualiza el estado con la lista de dispositivos conectados
                    });
                }
            } catch (error) {
                console.log("Error al recuperar el userId", error);
            }
        };

        fetchUserId();
    }, []); 

    const initializeDevicesToFalse = async () => {
        if (userId) {
            try {
                const devicesRef = ref(database, `usuarios/${userId}/devices`);
                const snapshot = await get(devicesRef);
                const devicesData = snapshot.val();
                const devicesList = devicesData ? Object.keys(devicesData).map(key => ({
                    id: key,
                    ...devicesData[key]
                })) : [];

                // Actualiza cada dispositivo a connected: false
                for (const device of devicesList) {
                    const deviceRef = ref(database, `usuarios/${userId}/devices/${device.id}`);
                    await update(deviceRef, { connected: false })
                        .catch((error) => console.log("Error updating device:", error));
                }

                // Después de actualizar a false, filtra y actualiza el estado con dispositivos conectados
                const updatedDevicesList = devicesList.filter(device => device.connected);
                setDevices(updatedDevicesList); // Actualiza el estado con dispositivos conectados (ninguno en este caso)
            } catch (error) {
                console.log("Error initializing devices:", error);
            }
        }
    };

    return (
        <View style={styles.sContainer}>
            <View style={styles.enLineaEsquina}>
                <Text style={styles.tittle}> Dispositivos </Text>
                
                <TouchableOpacity  onPress={initializeDevicesToFalse}>
                    <Image
                        source={require('../assets/Icons/Synchronize.png')}
                        style={[styles.sync, { tintColor: '#68A74D' }]}
                    />  
                </TouchableOpacity>
            </View>
           
            <FlatList
                data={devices}
                renderItem={({ item }) => (
                    <TouchableOpacity style={[styles.card, styles.enLinea]} onPress={() => handlePressDevice(item)}>
                        <Image
                            source={require('../assets/Icons/PottedPlant.png')}
                            style={[styles.icon, { tintColor: '#68A74D' }]}
                        />
                        <Text style={styles.cardTitle}>{item.id}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
            />
            {selectedDevice && (
                <DeviceModal
                    device={selectedDevice} // Pasamos el objeto del dispositivo
                    modalVisible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    sContainer: {
        flex: 1,
        paddingTop: 5,
    },
    tittle: {
        color: '#68A74D',
        fontSize: 30,
        paddingBottom: 10,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    centrar: {
        alignItems: 'center',
    },
    row: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        borderColor: '#68A74D',
        borderWidth: 3,
        paddingHorizontal: 10,
        paddingVertical: 15,
        margin: 5,
        width: '48%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flexShrink: 1, // ajusta el texto si es muy largo
    },
    enLinea: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal:15,
    },
    enLineaEsquina: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icon: {
        width: 50,
        height: 50,
        resizeMode: 'contain'
    },
    sync: {
        width: 35,
        height: 35,
        marginEnd:10,
    }
});
