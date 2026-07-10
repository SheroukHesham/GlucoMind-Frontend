/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import styles from '../Styles/HomeStylesheet';
import {ScrollView} from 'react-native-gesture-handler';
import Header from '../components/Header';
import {useUser} from '../contexts/userContext';
import {INavigation} from '../interfaces';

const ConfigureSensorScreen = ({navigation}: INavigation) => {
  const {user} = useUser();
  const [sensorId, setSensorId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!sensorId) {
      Alert.alert('Error', 'Please enter your Sensor ID');
      return;
    }
    setLoading(true);
    try {
      console.log('Connecting to sensor with ID:', user?._id);
      const response = await fetch(
        `http://10.0.2.2:3000/cgm/add-sensor/${user?._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sensorId: sensorId,
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Sensor connected successfully!');
        navigation.navigate('Drawer', {screen: 'Home'});
      } else {
        Alert.alert('Error', data.message || 'Failed to connect sensor');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <Header navigation={navigation} initials={'AA'} />
      <View style={[styles.container, {paddingTop: 40}]}>
        <Text style={[styles.sectionTitle, {textAlign: 'center'}]}>
          Configure Your Sensor
        </Text>
        <View style={{alignItems: 'center', marginVertical: 30}}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/123/123864.png',
            }}
            style={{width: 150, height: 150}}
            resizeMode="contain"
          />
        </View>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 8,
            marginBottom: 20,
            fontSize: 16,
          }}
          placeholder="Enter your Sensor ID"
          value={sensorId}
          onChangeText={setSensorId}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[
            styles.registerButton,
            {backgroundColor: '#28a745', marginBottom: 20},
          ]}
          onPress={handleConnect}
          disabled={loading}>
          <Text style={styles.registerText}>
            {loading ? 'Connecting...' : 'Connect'}
          </Text>
        </TouchableOpacity>
        <Text style={{fontSize: 16, lineHeight: 24}}>
          Please enter your Sensor ID and follow these steps:
        </Text>
        <Text style={{marginTop: 10, fontSize: 14, lineHeight: 22}}>
          1. Connect your phone to the sensor's WiFi network.{'\n'}
          2. Enter your phone's user credentials and the Sensor ID you entered
          above on the registration page.{'\n'}
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
