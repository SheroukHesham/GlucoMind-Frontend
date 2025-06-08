/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {SafeAreaView} from 'react-native';
import RegistrationForm from './Screens/RegistrationForm';
// import HomePage from './Pages/HomePage';
import NewHome from './Screens/NewHome';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigation from './navigation/MainNavigation';

const App = () => {
  return (
    // <RegistrationForm />
    <NavigationContainer>
      <MainNavigation />
    </NavigationContainer>
  );
};

export default App;
