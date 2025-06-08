/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// or react-native-vector-icons/Ionicons
import Clipboard from '@react-native-clipboard/clipboard';
import styles from '../Styles/HomeStylesheet';
import {ScrollView} from 'react-native-gesture-handler';
import Header from '../Components/Header';
const ConfigureSensorScreen = ({navigation, route}) => {
  // Assume userId passed via navigation params

  const {user} = route.params;

  const copyToClipboard = () => {
    Clipboard.setString(user._id);
    Alert.alert('Copied', 'User ID copied to clipboard');
  };

  return (
    <ScrollView>
      <Header navigation={navigation} initials={'AA'} />
      <View style={[styles.container, {paddingTop: 40}]}>
        <Text style={[styles.sectionTitle, {textAlign: 'center'}]}>
          Configure Your Sensor
        </Text>

        <View style={{alignItems: 'center', marginVertical: 30}}>
          {/* Replace with your sensor image */}
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/123/123864.png',
            }}
            style={{width: 150, height: 150}}
            resizeMode="contain"
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 8,
            marginBottom: 20,
          }}>
          <Text style={{flex: 1, fontSize: 16}}>{user._id}</Text>
          <TouchableOpacity onPress={copyToClipboard} style={{padding: 5}}>
            <Text style={{fontSize: 24}}>📋</Text>
          </TouchableOpacity>
        </View>

        <Text style={{fontSize: 16, lineHeight: 24}}>
          Please copy the User ID above and follow these steps:
        </Text>
        <Text style={{marginTop: 10, fontSize: 14, lineHeight: 22}}>
          1. Connect your phone to the sensor's WiFi network.{'\n'}
          2. Enter your phone's user credentials and the User ID you copied on
          the registration page.{'\n'}
          3. After setup, reconnect your phone to your usual WiFi network.{'\n'}
          4. The sensor will now connect and sync with your phone.
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.registerButton,
          {backgroundColor: '#007bff', margin: 30, marginTop: 10},
        ]}
        onPress={() => {
          navigation.navigate('Drawer', {screen: 'Home'});
        }}>
        <Text style={styles.registerText}>Proceed to Home Screen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ConfigureSensorScreen;
