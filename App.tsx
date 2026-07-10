/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import './global.css';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigation from './navigation/MainNavigation';
import {UserProvider} from './contexts/userContext';

const App = () => {
  useEffect(() => {
    // Listen for foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const message = remoteMessage?.notification?.body || '';
      const title = message.toLowerCase().includes('glucose')
        ? 'Glucose Level Alert'
        : 'Medication Reminder';
      Alert.alert(title, message);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Request notification permissions and get FCM token
    messaging().requestPermission();
    messaging()
      .getToken()
      .then((token: string) => {
        // Send token to backend and store with user
        console.log(token);
      });
  }, []);

  return (
    <UserProvider>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
