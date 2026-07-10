import React, {useState} from 'react';
import {View, TextInput, Text, TouchableOpacity, Alert} from 'react-native';
import styles from '../Styles/HomeStylesheet';
import {useUser} from '../contexts/userContext';
import messaging from '@react-native-firebase/messaging';
import {NavigationHelpers, ParamListBase} from '@react-navigation/native';

interface IProps {
  navigation: NavigationHelpers<ParamListBase, {}>;
}

const LoginScreen = ({navigation}: IProps) => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const {setUser, fcmToken, setFcmToken} = useUser();

  const validateEmail = (email: string) => {
    // Simple email regex validation
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async () => {
    const {email, password} = userData;
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password, fcmToken}),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Login successful!');
        setUser(result);
        await messaging().deleteToken();
        const newToken = await messaging().getToken();
        setFcmToken([newToken]);
        if (result && newToken) {
          console.log('Sending FCM token to server:', newToken);
          fetch(`http://10.0.2.2:3001/user/${result._id}/fcm-token`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({newToken}),
          });
        }
        navigation.navigate('Drawer', {
          screen: 'Home',
        });
      } else {
        Alert.alert('Error', result.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Could not connect to server.');
    }
  };

  return (
    <View
      className="flex-1 justify-center bg-slate-50 px-6"
      style={[styles.container]}>
      <Text className="mb-8 text-center text-2xl font-semibold text-blue-600">
        Login
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={userData.email}
        onChangeText={value => setUserData({...userData, email: value})}
        autoComplete="email"
        textContentType="emailAddress"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={userData.password}
        onChangeText={value => setUserData({...userData, password: value})}
        autoComplete="password"
        textContentType="password"
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleLogin}>
        <Text style={[styles.registerText]} className="text-lg">
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('RegistrationForm')}>
        <Text className="text-center mt-0">
          Don't have an account?{' '}
          <Text
            className="color-[#007AFF] underline"
            onPress={() => navigation.navigate('RegistrationForm')}>
            Register
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
