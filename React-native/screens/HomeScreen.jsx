import { useState , useEffect} from 'react';
import { View, TextInput, StyleSheet, Button, Modal, Image ,Text,TouchableOpacity,FlatList} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // para obtener iduser
import { ref, onValue } from 'firebase/database';
import { database } from '../conexion/firebaseConfig';
import DeviceModal from './Modal/DeviceModal'; 


  export default function HomeScreen({}) {
    const [devices, setDevices] = useState([]);
    const [userId, setUserId] = useState(''); // Estado para almacenar el userId

    const [modalVisible, setModalVisible] = useState(false); //esto para modal
    

    const [devicePath, setDevicePath] = useState('');//ruta para enviarsela a la modal
    
    const [selectedDevice, setSelectedDevice] = useState(null); //eso pra guardar el device k toco

    const handlePressDevice = (device) => {
        setSelectedDevice(device); // Ahora guardamos el objeto completo
        setModalVisible(true); // Abre la modal
    };

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId !== null) {
                    setUserId(storedUserId); // Actualiza el estado con el userId recuperado
                    setDevicePath(`usuarios/${storedUserId}/devices`);//garda la ruta
                    // Una vez que tenemos el userId, podemos obtener los dispositivos
                    const devicesRef = ref(database, `usuarios/${storedUserId}/devices`);
                    onValue(devicesRef, (snapshot) => {
                        const devicesData = snapshot.val();
                        const devicesList = devicesData ? Object.keys(devicesData).map(key => ({
                            id: key,
                            ...devicesData[key]
                        })) : [];
                        setDevices(devicesList);
                    });
                }
            } catch (error) {
                console.log("Error al recuperar el userId", error);
            }
        };
    
        fetchUserId();
        

    }, []);


    return (
        <View style={[styles.sContainer, { }]}>
            <Text style={styles.tittle}> Dispositivos </Text>
           
            <FlatList
                data={devices}
                renderItem={({ item }) => (
                <TouchableOpacity style={[styles.card,styles.enLinea]} onPress={() => handlePressDevice(item)}>
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
               <DeviceModal
                device={selectedDevice} // Pasamos el objeto del dispositivo
                modalVisible={modalVisible}
                onClose={() => setModalVisible(false)}
              />
        </View>
    );
}



const styles = new StyleSheet.create({
    sContainer: {
        flex: 1,
        paddingTop: 5,
    },
    tittle:{
        color: '#68A74D', 
        fontSize: 30 ,
        paddingBottom:10,
        fontWeight: 'bold',
        fontStyle:'italic',
    },
    centrar: {
        alignItems:'center',
    },
    row: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        borderColor:'#68A74D',
        borderWidth:3,
        paddingHorizontal: 10,
        paddingVertical: 15,
        margin: 5,
        width: '48%',
        // Sombra para el estilo de tarjeta
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
    enLinea:{
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center',
    },
    icon: {
        width: 50,
        height: 50,
        resizeMode: 'contain'
    }
  });