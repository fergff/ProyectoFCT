import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet,Alert,Image } from 'react-native';
import {  ref, set, get, query, orderByChild, equalTo} from 'firebase/database';
import { database } from '../conexion/firebaseConfig';
import CustomAlert from '../components/CustomAlert';//para las alertas customs

const RegisterModal = ({ isVisible, onClose,onCancel }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    setIsVisible(false);
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor, rellena todos los campos.');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return; 
    }
  
    // Verifica si el nombre de usuario ya existe
    const usersRef = ref(database, 'usuarios/');
    const usersQuery = query(usersRef, orderByChild('name'), equalTo(name));
    const snapshot = await get(usersQuery);
    if (snapshot.exists()) {
      Alert.alert('Error', 'El nombre de usuario ya está en uso. Elige otro nombre.');
      return;
    }
  
    // Si el nombre de usuario no existe, procede a crear el nuevo usuario
    const newUserId = 'user' + Date.now(); // Esto crea un ID único basado en el timestamp actual
    const newUserRef = ref(database, `usuarios/${newUserId}`);
    set(newUserRef, {
      email: email,
      name: name,
      pass: password,
      devices: {} // Inicializar sin dispositivos
    });
  
    Alert.alert('Registro exitoso', 'El usuario ha sido creado con éxito.');
    onCancel(); // Cierra el modal después del registro
  };

  return (
    <Modal visible={isVisible} 
      animationType="slide" 
      onRequestClose={onClose} 
      transparent={true}
    >
      <View style={styles.modalContent}>
        <View style={styles.border}>
          <Text style={styles.tittle}>Registrarse</Text>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
          <TextInput placeholder="Nombre" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
          <TextInput placeholder="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
          <View style={styles.enLinea}>
              <TouchableOpacity onPress={handleRegister} style={styles.button}>
                <Text style={styles.buttonText}>Registrate</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onCancel} style={styles.button}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
          </View>
        </View>
        
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    paddingHorizontal:20,
    paddingTop:50,
    alignItems:'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical:5,
    borderWidth: 1.5,
    borderColor: '#68A74D',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#68A74D',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width:'40%',
  },
  buttonText: {
    color: '#ffffff',
    textAlign:'center',
    fontSize:18,
  },
  enLinea:{
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center',
  },
  border:{
    marginTop:'25%',
    width:'100%',
    height: 'auto',
    paddingVertical:15,
    borderRadius: 15,
    borderColor:'#68A74D',
    borderWidth:3,
    padding: 15,
  },
  tittle:{
    color: '#68A74D', 
    fontSize: 30 ,
    paddingBottom:20,
    fontWeight: 'bold',
    fontStyle:'italic',
  },
});

export default RegisterModal;
