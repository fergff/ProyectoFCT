import { useState , useEffect} from 'react';
import { View, TextInput, StyleSheet, Button, Modal, Image ,Text,TouchableOpacity} from 'react-native';
import { Feather } from '@expo/vector-icons';


  

  export default function HomeScreen({}) {

    const color= "#0d1017";
    return (
        <View style={[styles.sContainer, { }]}>
            <Text style={{ color: 'black', fontSize: 30 ,paddingBottom:20}}> Cuenta </Text>
            <View style={styles.linea} />
        </View>
    );
}

const styles = new StyleSheet.create({
    sContainer: {
        flex: 1,
        paddingTop: 5,
    },
    centrar: {
        alignItems:'center',
    },
    linea: {
        borderBottomColor: '#68A74D', // Color de la línea
        borderBottomWidth: 2, // Grosor de la línea
        alignSelf: 'stretch', // Hace que la línea se extienda en el ancho disponible
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end', // Asegura que el botón esté al final del contenedor
      alignItems:'center',
      width: '100%', // Ocupa todo el ancho de la pantalla
      marginBottom:15,
    },
    boton: {
      width: '80%', // Hace que el TouchableOpacity ocupe todo el ancho de la pantalla
      backgroundColor: '#ffc83d', // Fondo del botón
      padding: 10, // Espaciado interno del botón
      borderRadius: 5, // Bordes redondeados del botón
    },
    botonText: {
      fontSize: 20,
      color: 'black',
      textAlign: 'center', // Centra el texto dentro del botón
    },
  });