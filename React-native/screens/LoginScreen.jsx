import React, { useState,useEffect  } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,Modal,Image} from 'react-native';
import { get, ref, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../conexion/firebaseConfig'; // conexion con firebase
import RegisterModalContent from '../screens/RegisterModal'; //la modla
import AsyncStorage from '@react-native-async-storage/async-storage'; // para guardar el userid

const LoginScreen = ({ onLogin, onShowRegister }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // Efecto para verificar si existe una sesión almacenada al cargar el componente
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        // Si hay un userId almacenado, autenticar directamente
        Alert.alert('Autenticación', 'Autenticado automáticamente.');
        onLogin(); // Procesa el login automáticamente
      }
    };

    checkUserLoggedIn();
  }, []);

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
      <View style={styles.imgContainer}>
        <Image source={require('../assets/Icons/LogoLogin.png')} style={styles.logo} />
      </View>
      <TextInput placeholder="Nombre" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
        <Image source={require('../assets/Icons/iconLogin.png')} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onShowRegister} style={styles.registerButton}>
        <Text style={[styles.registerText,styles.mT10]}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:'30%',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    margin: 10,
    borderWidth: 1.5,
    borderColor: '#68A74D',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#68A74D',
    paddingVertical: 10,
    paddingHorizontal:15,
    borderRadius: 5,
    flexDirection:'row',
  },
  buttonText: {
    color: '#ffffff',
    fontSize:18,
    marginEnd:5,
  },
  mT10: {
    marginTop: 20,
  },
  registerText: {
    color: '#68A74D',
    fontWeight:'bold',
    fontStyle:'italic',
    fontSize:18,
    textDecorationLine: 'underline',
  },
  imgContainer:{
    flexDirection:'row',
    alignItems: 'center',
    marginBottom:'15%',
  },
  logo:{
    width:270,
    height:140,
    resizeMode:'stretch',
  }
});
export default LoginScreen;
