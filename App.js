/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';

import {SafeAreaView} from 'react-native';
import RegistrationForm from './Screens/RegistrationForm';
// import HomePage from './Pages/HomePage';
import NewHome from './Screens/NewHome';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigation from './navigation/MainNavigation';
import {UserProvider} from './contexts/userContext';

const App = () => {
  useEffect(() => {
    // Listen for foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('Medication Reminder', remoteMessage.notification.body);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Request notification permissions and get FCM token
    messaging().requestPermission();
    messaging()
      .getToken()
      .then(token => {
        // Send token to backend and store with user
      });
  }, []);

  return (
    // <RegistrationForm />
    <UserProvider>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
