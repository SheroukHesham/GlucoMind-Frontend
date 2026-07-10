import {ScrollView, Text, TextInput} from 'react-native-gesture-handler';
import styles from '../Styles/RegistrationStylesheet';
import {defaultUser, inputFields} from '../data';
import {useState} from 'react';
import {IUser} from '../interfaces';
import Selector from '../components/Selector';
import MealPreferences from '../components/MealPreferences';
import {View} from 'react-native';

const Register = () => {
  const [newUser, setNewUser] = useState<IUser>(defaultUser);
  const [focusedField, setFocusedField] = useState('');
  console.log(newUser);

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
