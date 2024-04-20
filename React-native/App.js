import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import RegisterScreen from './screens/RegisterModal';

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleLogin = (userId) => {
    setUserLoggedIn(true);
    setUserId(userId);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleCancelRegister = () => {
    setShowRegister(false);
  };

  return (
    <View style={styles.container}>
      {!userLoggedIn ? (
        !showRegister ? (
          <LoginScreen onLogin={handleLogin} onShowRegister={handleShowRegister} />
        ) : (
          <RegisterScreen onCancel={handleCancelRegister} />
        )
      ) : (
        <MainScreen userId={userId} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
