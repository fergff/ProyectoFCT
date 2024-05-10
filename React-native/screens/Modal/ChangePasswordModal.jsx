import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';

const ChangePasswordModal = ({ visible, onClose }) => {
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
              <Text style={styles.modalText}>Formulario para cambiar contraseña...</Text>
              <TouchableOpacity style={styles.buttonChange} onPress={onClose}>
                <Text style={styles.textButton}>Cambiar</Text>
              </TouchableOpacity>
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
    height: '30%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
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
  modalText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20
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
