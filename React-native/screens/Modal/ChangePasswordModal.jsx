import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, ref, update } from 'firebase/database';

const ChangePasswordModal = ({ visible, onClose }) => {
  // Estados para almacenar las nuevas contraseñas
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Maneja el cambio de contraseña
  const handleChangePassword = async () => {
    // Verifica si los campos de contraseña no están vacíos
    if (newPassword === '' || confirmPassword === '') {
      Alert.alert("Error", "Rellena todos los campos.");
      return;
    }

    // Verifica si las contraseñas coinciden
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    try {
      // Obtiene el ID de usuario almacenado en AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('No se encontró el ID de usuario');

      // Obtiene una instancia de la base de datos
      const db = getDatabase();
      const userRef = ref(db, `usuarios/${userId}`); // Referencia al usuario

      // Actualiza la contraseña en la base de datos
      await update(userRef, { pass: newPassword });
      Alert.alert("Éxito", "Contraseña actualizada con éxito!");
      onClose();
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      Alert.alert("Error", "Error al cambiar la contraseña");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.outerModalView}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.tallModalView}>
              <View style={styles.border}>
                <Text style={styles.tittle}>Cambiar Contraseña:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setNewPassword}
                  value={newPassword}
                  secureTextEntry
                  placeholder="Nueva Contraseña"
                />
                <TextInput
                  style={styles.input}
                  onChangeText={setConfirmPassword}
                  value={confirmPassword}
                  secureTextEntry
                  placeholder="Confirmar contraseña"
                />
                <TouchableOpacity style={styles.buttonChange} onPress={handleChangePassword}>
                  <Text style={styles.textButton}>Cambiar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  outerModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tallModalView: {
    width: '90%',
    height: '50%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
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
  tittle:{
    color: '#68A74D', 
    fontSize: 30,
    paddingBottom: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  border:{
    width: '100%',
    height: '100%',
    borderRadius: 15,
    borderColor: '#68A74D',
    borderWidth: 3,
    padding: 15,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc'
  },
  buttonContainerEnd: {
    width: '100%',
    flex: 1, // Toma todo el espacio restante
    justifyContent: 'flex-end', // Alinea el botón hacia el final del contenedor
    alignItems: 'center',
    paddingBottom: 15,
  },
  buttonChange: {
    backgroundColor: "#68A74D",
    borderRadius: 5,
    padding: 10,
    elevation: 2
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
});

export default ChangePasswordModal;
