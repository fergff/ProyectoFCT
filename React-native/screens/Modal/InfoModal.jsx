import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const InfoModal = ({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.fullScreenModalView}>
        <Text style={styles.modalText}>Inofrmacion de la Aplicacion</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenModalView: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20
  },
});

export default InfoModal;
