/* eslint-disable react-native/no-inline-styles */
// App.tsx or RegistrationForm.tsx

import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  View,
} from 'react-native';
import styles from '../Styles/RegistrationStylesheet';
import EmergencyContacts from '../Components/EmergencyContacts';

// TODO: Change the food items to a more comprehensive list
const foodItems = ['Pizza', 'Salad', 'Burger', 'Fish', 'Pasta', 'Others'];

const Bubble = ({label, selected, onPress}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.bubble, selected && styles.bubbleSelected]}>
    <Text style={[styles.bubbleText, selected && styles.bubbleTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const RegistrationForm = () => {
  // ACCOUNT INFORMATION
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [dailyCalories, setDailyCalories] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [likedMeals, setLikedMeals] = useState([]);
  const [dislikedMeals, setDislikedMeals] = useState([]);
  const [contacts, setContacts] = useState([
    {name: '', phone: '', email: ''}, // at least one contact initially
  ]);
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [medications, setMedications] = useState([]);

  const accountFields = [
    {label: 'Name', value: name, setter: setName},
    {label: 'Email', value: email, setter: setEmail},
    {label: 'Password', value: password, setter: setPassword},
    {label: 'Age', value: age, setter: setAge},
    {label: 'Gender', value: gender, setter: setGender},
    {label: 'Daily Calories', value: dailyCalories, setter: setDailyCalories},
  ];

  const toggleMeal = (meal, isLiked) => {
    const targetList = isLiked ? likedMeals : dislikedMeals;
    const setList = isLiked ? setLikedMeals : setDislikedMeals;

    if (targetList.includes(meal)) {
      setList(targetList.filter(m => m !== meal));
    } else {
      setList([...targetList, meal]);
    }

    console.log(likedMeals);
  };

  //-- EMERGENCY CONTACTS STATE --//

  // Handle input change per contact
  const updateContact = (index, field, value) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

  // Add new empty contact
  const addContact = () => {
    setContacts([...contacts, {name: '', phone: '', email: ''}]);
  };

  const removeContact = index => {
    if (contacts.length > 1) {
      const updated = [...contacts];
      updated.splice(index, 1);
      setContacts(updated);
    }
  };
  // Validate contacts before submitting
  const validateContacts = () => {
    for (let i = 0; i < contacts.length; i++) {
      const c = contacts[i];
      if (!c.name.trim() || !c.phone.trim() || !c.email.trim()) {
        Alert.alert(
          'Validation Error',
          `Please enter name, phone number and email for contact #${i + 1}`,
        );
        return false;
      }
    }
    return true;
  };

  // -- MEDICATION STATE--//

  const addMedication = () => {
    setMedications([...medications, {name: '', time: ''}]);
  };

  const updateMedication = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const removeMedication = index => {
    const updated = [...medications];
    updated.splice(index, 1);
    setMedications(updated);
  };

  // -- MEDICAL CONDITIONS STATE --//
  const addCondition = () => {
    setMedicalConditions([...medicalConditions, '']);
  };

  const updateCondition = (index, value) => {
    const updated = [...medicalConditions];
    updated[index] = value;
    setMedicalConditions(updated);
  };

  const removeCondition = index => {
    const updated = [...medicalConditions];
    updated.splice(index, 1);
    setMedicalConditions(updated);
  };

  // -- DIETARY RESTRICTIONS--//
  const addDietaryRestriction = () => {
    setDietaryRestrictions([...dietaryRestrictions, '']);
  };

  const updateDietaryRestriction = (index, value) => {
    const updated = [...dietaryRestrictions];
    updated[index] = value;
    setDietaryRestrictions(updated);
  };

  const removeDietaryRestriction = index => {
    const updated = [...dietaryRestrictions];
    updated.splice(index, 1);
    setDietaryRestrictions(updated);
  };

  // --ON REGISTRATION--//

  const validateAccountInfo = () => {
    // Validate text fields
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !age.trim() ||
      !gender.trim() ||
      !dailyCalories.trim()
    ) {
      Alert.alert(
        'Validation Error',
        'Please fill out all required account fields.',
      );
      return false;
    }

    // Validate liked/disliked meals
    if (likedMeals.length < 3) {
      Alert.alert('Validation Error', 'Please select at least 3 liked meals.');
      return false;
    }

    if (dislikedMeals.length < 3) {
      Alert.alert(
        'Validation Error',
        'Please select at least 3 disliked meals.',
      );
      return false;
    }

    if (contacts.length === 0) {
      Alert.alert(
        'Validation Error',
        'Please add at least one emergency contact.',
      );
      return false;
    }

    // Validate emergency contacts
    for (let i = 0; i < contacts.length; i++) {
      const c = contacts[i];
      if (!c.name.trim() || !c.phone.trim() || !c.email.trim()) {
        Alert.alert(
          'Validation Error',
          `Please enter name, phone number, and email for emergency contact #${
            i + 1
          }`,
        );
        return false;
      }
    }

    return true;
  };

  // Inside your component
  const handleRegistration = async () => {
    if (!validateAccountInfo()) return;

    const registrationData = {
      // TODO: MAP TO BACKEND DATABASE
      name: name,
      email: email,
      password: password,
      age: age,
      gender: gender,
      dailyCalories: dailyCalories,
      dietaryRestrictions: dietaryRestrictions,
      likedMeals: likedMeals,
      dislikedMeals: dislikedMeals,
      emergencyContacts: contacts,
      medications: medications,
      medicalConditions: medicalConditions,
    };

    // TODO: Uncomment during backend integration
    // TODO: backend should return the userId of the user
    // try {
    //   // TODO: Replace with actual URL
    //   const response = await fetch('http://<YOUR_BACKEND_URL>/api/register', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(registrationData),
    //   });

    //   const result = await response.json();
    //   if (response.ok) {
    //     Alert.alert('Success', 'Registration completed!');
    //   } else {
    //     Alert.alert('Error', result.message || 'Registration failed.');
    //   }
    // } catch (error) {
    //   console.error('Registration error:', error);
    //   Alert.alert('Error', 'Could not connect to server.');
    // }
  };

  return (
    <ScrollView style={styles.container}>
      {/* ACCOUNT INFO */}
      <Text style={styles.sectionTitle}>Account Information</Text>
      {accountFields.map(({label, value, setter}) => (
        <TextInput
          key={label}
          placeholder={label}
          style={styles.input}
          value={value}
          onChangeText={setter}
          secureTextEntry={label === 'Password'}
          keyboardType={
            label === 'Email'
              ? 'email-address'
              : label === 'Age' || label === 'Daily Calories'
              ? 'numeric'
              : 'default'
          }
        />
      ))}

      {/* MEALS SECTION */}
      <Text style={styles.sectionTitle}>Liked Meals (3)</Text>
      <FlatList
        data={foodItems}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Bubble
            label={item}
            selected={likedMeals.includes(item)}
            onPress={() => {
              toggleMeal(item, true);
            }}
          />
        )}
      />

      <Text style={styles.sectionTitle}>Disliked Meals (3)</Text>
      <FlatList
        data={foodItems}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Bubble
            label={item}
            selected={dislikedMeals.includes(item)}
            onPress={() => toggleMeal(item, false)}
          />
        )}
      />

      {/* EMERGENCY CONTACTS */}
      <Text style={styles.sectionTitle}>Emergency Contacts (At least 1)</Text>
      <EmergencyContacts />

      {/* MEDICATIONS */}
      <Text style={styles.sectionTitle}>Medications</Text>
      {medications.map((med, index) => (
        <React.Fragment key={index}>
          <TextInput
            style={styles.input}
            placeholder="Medication Name"
            value={med.name}
            onChangeText={text => updateMedication(index, 'name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Time of Intake"
            value={med.time}
            onChangeText={text => updateMedication(index, 'time', text)}
          />
          <TouchableOpacity
            onPress={() => removeMedication(index)}
            style={styles.addContainer}>
            <Text style={[styles.plusIcon, {color: '#d00e0e'}]}>-</Text>
            <Text style={[styles.addField, {color: '#d00e0e'}]}>
              Remove Medication
            </Text>
          </TouchableOpacity>
        </React.Fragment>
      ))}
      <TouchableOpacity onPress={addMedication} style={styles.addContainer}>
        <Text style={styles.plusIcon}>+</Text>
        <Text style={styles.addField}>Add Medication</Text>
      </TouchableOpacity>

      {/* MEDICAL CONDITIONS */}
      <Text style={styles.sectionTitle}>Other Medical Conditions</Text>
      {medicalConditions.map((condition, index) => (
        <React.Fragment key={index}>
          <TextInput
            style={styles.input}
            placeholder="Enter condition"
            value={condition}
            onChangeText={text => updateCondition(index, text)}
          />
          <TouchableOpacity
            onPress={() => removeCondition(index)}
            style={styles.addContainer}>
            <Text style={[styles.plusIcon, {color: '#d00e0e'}]}>-</Text>
            <Text style={[styles.addField, {color: '#d00e0e'}]}>
              Remove Condition
            </Text>
          </TouchableOpacity>
        </React.Fragment>
      ))}

      <TouchableOpacity onPress={addCondition} style={styles.addContainer}>
        <Text style={styles.plusIcon}>+</Text>
        <Text style={styles.addField}>Add Condition</Text>
      </TouchableOpacity>

      {/* Dietary Restrictions */}
      <Text style={styles.sectionTitle}>Dietary Restrictions / Allergies</Text>
      {medicalConditions.map((restriction, index) => (
        <React.Fragment key={index}>
          <TextInput
            style={styles.input}
            placeholder="Enter Dietary Restriction"
            value={restriction}
            onChangeText={text => updateDietaryRestriction(index, text)}
          />
          <TouchableOpacity
            onPress={() => removeDietaryRestriction(index)}
            style={styles.addContainer}>
            <Text style={[styles.plusIcon, {color: '#d00e0e'}]}>-</Text>
            <Text style={[styles.addField, {color: '#d00e0e'}]}>
              Remove Dietary Restriction
            </Text>
          </TouchableOpacity>
        </React.Fragment>
      ))}

      <TouchableOpacity
        onPress={addDietaryRestriction}
        style={styles.addContainer}>
        <Text style={styles.plusIcon}>+</Text>
        <Text style={styles.addField}>Add Dietary Restriction</Text>
      </TouchableOpacity>

      {/* REGISTER */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegistration}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegistrationForm;
