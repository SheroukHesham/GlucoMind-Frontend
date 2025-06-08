/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, TextInput, Text, TouchableOpacity, Alert} from 'react-native';
import styles from '../Styles/HomeStylesheet';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = email => {
    // Simple email regex validation
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // TODO: Replace with real backend login logic
    console.log('Login with', {email, password});
    navigation.navigate('Drawer', {screen: 'Home'});
  };

  return (
    <View style={[styles.container, {justifyContent: 'center', flex: 1}]}>
      <Text
        style={[
          styles.sectionTitle,
          {
            textAlign: 'center',
            color: '#007aff',
            marginBottom: 30,
            fontSize: 25,
          },
        ]}>
        Login
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        autoComplete="email"
        textContentType="emailAddress"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoComplete="password"
        textContentType="password"
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleLogin}>
        <Text style={[styles.registerText, {fontSize: 18}]}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RegistrationForm')}>
        <Text style={{textAlign: 'center', marginTop: 0}}>
          Don't have an account?{' '}
          <Text
            style={{color: '#007AFF', textDecorationLine: 'underline'}}
            onPress={() => navigation.navigate('RegistrationForm')}>
            Register
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
