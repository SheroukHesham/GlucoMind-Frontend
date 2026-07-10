import {ScrollView, Text, TextInput} from 'react-native-gesture-handler';
import styles from '../Styles/RegistrationStylesheet';
import {defaultUser, inputFields} from '../data';
import {useState} from 'react';
import {INavigation, IUser} from '../interfaces';
import Selector from '../components/Selector';
import MealPreferences from '../components/MealPreferences';
import {Alert, View} from 'react-native';
import {useUser} from '../contexts/userContext';

const testUser: IUser = {
  age: '24',
  dailyCalories: 1500,
  dietaryRestrictions: ['milk'],
  dislikedRecipes: ['peas', 'beans', 'meat'],
  email: 'test1@test.com',
  emergencyContacts: [
    {
      name: 'test',
      phone: '0224478965',
      email: 'tes@tes.com',
    },
  ],
  gender: 'Female',
  likedRecipes: ['chicken', 'bread', 'tomato'],
  medicalConditions: [],
  medications: [],
  name: 'sherouk',
  password: '123456',
};

const Register = ({navigation}: INavigation) => {
  const [newUser, setNewUser] = useState<IUser>(testUser);
  const [focusedField, setFocusedField] = useState('');
  const {fcmToken, setUser} = useUser();

  const handleRegistration = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const result = await response.json();
      console.log('Registration result:', result);

      if (response.ok) {
        Alert.alert('Success', 'Registration completed!');
        // Update FCM token for the new user
        if (result && fcmToken) {
          fetch(`http://10.0.2.2:3001/user/${result._id}/fcm-token`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: result.email, fcmToken}),
          });
        }
        // Set user in context
        setUser(result);
        // Trigger meal plan generation for the new user
        try {
          await fetch(`http://10.0.2.2:3004/recommend/${result._id}`, {
            method: 'POST',
          });
        } catch (err) {
          console.warn('Failed to trigger meal plan generation:', err);
        }
        navigation.navigate('Drawer', {
          screen: 'Configure Sensor',
          params: {user: result},
        });
      } else {
        Alert.alert('Error', result.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Could not connect to server.');
    }
  };

  handleRegistration();

  const renderAccountInformation = inputFields.map((input, idx) => {
    const {label, type} = input;
    return (
      <TextInput
        className={`border  rounded-lg px-5 mb-[10] ${focusedField === label ? 'border-[#007bff] ' : 'border-[#ccc]'}`}
        key={idx}
        placeholder={label}
        value={newUser[input.name].toString()}
        onChangeText={text =>
          setNewUser(prev => ({...prev, [input.name]: text}))
        }
        secureTextEntry={label === 'Password'}
        keyboardType={type}
        onFocus={() => setFocusedField(label)}
        onBlur={() => setFocusedField('')}
      />
    );
  });

  return (
    <ScrollView>
      <View className="px-2 mt-10">
        <Text style={styles.sectionTitle}>Account Information</Text>
        {renderAccountInformation}
        {/* <Selector /> */}

        {/* Liked and Disliked Meals */}
        <MealPreferences user={newUser} setUser={setNewUser} forLiked={true} />
        <MealPreferences user={newUser} setUser={setNewUser} forLiked={false} />

        <Text style={styles.sectionTitle}>Emergency Contacts (At least 1)</Text>
      </View>
    </ScrollView>
  );
};

export default Register;
