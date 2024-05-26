import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal,Image } from 'react-native';

const InfoModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenModalView}>
        <View style={styles.headerContainer}>
            <Text style={styles.tittle}>TFG Plants4All</Text>
            <Image style={styles.image}
              source={require('../../assets/Icons/azarquielLogo.png')}
            />
        </View>
        <Text style={styles.modalText}>Creado y Diseñado por:</Text>
        <Text style={styles.modalText}>Fernando Guio Franco</Text>
        <Text style={styles.subtittle}>Librerias Utilizadas:</Text>
        <Text style={styles.modalText}>-@react-native-firebase/app</Text>
        <Text style={styles.modalText}>-@react-native-firebase/database</Text>
        <Text style={styles.modalText}>-@react-native-picker/picker </Text>
        <Text style={styles.modalText}>-@react-native-async-storage/async-storage</Text>
        <Text style={styles.modalText}>-expo-updates</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
  },
  fullScreenModalView: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  modalText: {
    fontSize: 18,

  },
  tittle:{
    color: '#68A74D', 
    fontSize: 30 ,
    fontWeight: 'bold',
    fontStyle:'italic',
  },
  subtittle:{
    color: '#68A74D', 
    fontSize: 25 ,
    paddingBottom:10,
    marginTop:10,
    fontWeight: 'bold',
  },
  image: {
    width: 80,
    height: 80,
  },
});

export default InfoModal;
