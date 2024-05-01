import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,Modal} from 'react-native';
import { get, ref, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../conexion/firebaseConfig'; // conexion con firebase
import RegisterModalContent from '../screens/RegisterModal'; //la modla
import AsyncStorage from '@react-native-async-storage/async-storage'; // para guardar el userid

const LoginScreen = ({ onLogin,onShowRegister }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);

  const handleLogin = async () => {
    // Define la referencia al nodo de usuarios en Firebase
    const usersRef = ref(database, 'usuarios');
    
    // Realiza una consulta para encontrar el usuario por nombre
    const userQuery = query(usersRef, orderByChild('name'), equalTo(name));
  
    try {
      const snapshot = await get(userQuery);
      if (snapshot.exists()) {
        let userKey = null;
        let userData = null;
  
        // Recorre los resultados. En teoría, debería haber solo un resultado dado que 'name' es único.
        // Sin embargo, usamos un bucle para encontrar el correcto en caso de que haya más de uno por alguna razón.
        snapshot.forEach((childSnapshot) => {
          // Verifica la contraseña antes de decidir si este es el usuario correcto
          if (childSnapshot.val().pass === password) {
            userKey = childSnapshot.key;
            userData = childSnapshot.val();
          }
        });
  
        if (userKey && userData) {
          // Si se encontró un usuario con el nombre y contraseña correctos, guarda su userId
          await AsyncStorage.setItem('userId', userKey);
          Alert.alert('Inicio de sesión exitoso', `Bienvenido ${userData.name}`);
          onLogin(); // Puedes pasar userKey si necesitas manejarlo en el método onLogin
        } else {
          // Si userKey sigue siendo null, significa que no encontramos un usuario con esa contraseña
          Alert.alert('Error', 'Contraseña incorrecta');
        }
      } else {
        Alert.alert('Error', 'Usuario no encontrado');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error durante el inicio de sesión');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nombre" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onShowRegister} style={styles.registerButton}>
        <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
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
  },
  buttonText: {
  color: '#ffffff',
  },
  registerMessage: {
    marginTop: 20,
  },
  registerText: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});
export default LoginScreen;
