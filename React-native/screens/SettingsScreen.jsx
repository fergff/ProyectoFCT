import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InfoModal from './Modal/InfoModal'; 
import ChangePasswordModal from './Modal/ChangePasswordModal';

export default function SettingsScreen({ onLogout }) {
  // Estado para almacenar el userId
  const [userId, setUserId] = useState(null);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] = useState(false);

  // Cargar el userId desde AsyncStorage cuando se monte el componente
  useEffect(() => {
    const loadUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    };
    loadUserId();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      onLogout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <View style={styles.sContainer}>
      <Text style={styles.tittle}>Cuenta :</Text>
      <Text style={styles.subTittle}>UserID: {userId}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => setChangePasswordModalVisible(true)} style={[styles.button, styles.bgChange]}>
          <Text style={styles.botonText}>Cambiar Contraseña</Text>
          <Image source={require('../assets/Icons/Password.png')} style={styles.logoBoton} />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogout} style={[styles.button, styles.bgSession]}>
          <Text style={styles.botonText}>Cerrar sesión</Text>
          <Image source={require('../assets/Icons/Logout.png')} style={styles.logoBoton} />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainerEnd}>
        <TouchableOpacity onPress={() => setInfoModalVisible(true)} style={[styles.button, styles.bgInfo]}>
          <Text style={styles.botonText}>Acerca De</Text>
          <Image source={require('../assets/Icons/Info.png')} style={styles.logoBoton} />
        </TouchableOpacity>
      </View> 

      <InfoModal visible={isInfoModalVisible} onClose={() => setInfoModalVisible(false)} />
      <ChangePasswordModal visible={isChangePasswordModalVisible} onClose={() => setChangePasswordModalVisible(false)} />
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
  subTittle: {
    color: '#737373',
    fontSize: 20,
    paddingLeft: 20,
    paddingBottom: 10,
  },
  buttonContainer: {
    marginTop: 15,
    alignItems: 'center',
    width: '100%',
  },
  buttonContainerEnd: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 15,
  },
  button: {
    width: '93%',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  bgSession: {
    backgroundColor: '#ed0000',
  },
  bgChange: {
    backgroundColor: '#ff9c00',    
  },
  bgInfo: {
    backgroundColor: '#bababa',
    paddingVertical: 18,
  },
  botonText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoBoton: {
    width: 30,
    height: 30,
  }
});