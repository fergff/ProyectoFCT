import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet,Alert } from 'react-native';
import {  ref, set, get, query, orderByChild, equalTo} from 'firebase/database';
import { database } from '../conexion/firebaseConfig';
import CustomAlert from '../components/CustomAlert';//para las alertas customs

const RegisterModal = ({ isVisible, onClose,onCancel }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {

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
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput placeholder="Nombre" value={name} onChangeText={setName} style={styles.input} />
        <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <TextInput placeholder="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} />
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} style={styles.button}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    width: '80%',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
  },
});

export default RegisterModal;
