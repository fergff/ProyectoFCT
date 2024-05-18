import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterModal';
import { NavigationContainer } from '@react-navigation/native';
import Mytabs from './components/Mytabs';

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = () => {
    setUserLoggedIn(true);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleCancelRegister = () => {
    setShowRegister(false);
  };
  const handleClose = () =>  setShowRegister(false);
  
  return (
    <NavigationContainer>
      <View style={styles.container}>
        {!userLoggedIn ? (
          !showRegister ? (
            <LoginScreen onLogin={handleLogin} onShowRegister={handleShowRegister} />
          ) : (
            <RegisterScreen onClose={handleClose} onCancel={handleCancelRegister} />
          )
        ) : (
          <Mytabs />
        )}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});