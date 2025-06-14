/* eslint-disable react-native/no-inline-styles */
// App.tsx or RegistrationForm.tsx

import React, {useState, useEffect} from 'react';
import {useUser} from '../contexts/userContext';
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
import MedicationSection from '../Components/EditMedicationSection';
import messaging from '@react-native-firebase/messaging';

// TODO: Change the food items to a more comprehensive list
const foodItems = ['Pizza', 'Salad', 'Burger', 'Fish', 'Pasta', 'Others'];

const Bubble = ({label, selected, onPress, type}) => {
  // type will be 'like' or 'dislike'

  // Colors based on type and selection
  const backgroundColor = selected
    ? type === 'like'
      ? '#4CAF50'
      : '#E53935' // green or red
    : '#CCC';

  const textColor = selected ? '#fff' : '#333';

  const emoji = type === 'like' ? '👍' : '👎';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.bubble,
        {backgroundColor},
        !selected && {borderColor: '#CCC', borderWidth: 2},
        selected && {borderColor: 'transparent', borderWidth: 0},
      ]}>
      <Text style={[styles.bubbleText, {color: textColor}]}>
        {emoji} {label}
      </Text>
    </TouchableOpacity>
  );
};

const RegistrationForm = ({navigation}) => {
  // ACCOUNT INFORMATION
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [dailyCalories, setDailyCalories] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [likedMeals, setLikedMeals] = useState([]);
  const [focusedField, setFocusedField] = useState('');
  const [dislikedMeals, setDislikedMeals] = useState([]);
  const [contacts, setContacts] = useState([]);

  const [medicalConditions, setMedicalConditions] = useState([]);
  const [medications, setMedications] = useState([]);

  const [expandedMedIndex, setExpandedMedIndex] = useState(null);
  const [medicationTime, setMedicationTime] = useState({});

  const [errors, setErrors] = useState({});

  const {fcmToken} = useUser();

  useEffect(() => {
    let updatedErrors = {...errors};

    if (likedMeals.length < 3) {
      updatedErrors.likedMeals = 'Select at least 3 liked meals.';
    } else {
      delete updatedErrors.likedMeals;
    }

    if (dislikedMeals.length < 3) {
      updatedErrors.dislikedMeals = 'Select at least 3 disliked meals.';
    } else {
      delete updatedErrors.dislikedMeals;
    }

    const isDifferent =
      JSON.stringify(errors) !== JSON.stringify(updatedErrors);
    if (isDifferent) {
      setErrors(updatedErrors);
    }
  }, [likedMeals, dislikedMeals, errors]);

  const onChangeField = (list, setList, index, value) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };

  // Generic helper functions for managing lists
  const addItem = (list, setList, newItem) => {
    setList([...list, newItem]);
  };

  const updateItem = (list, setList, index, field, value) => {
    const updated = [...list];
    updated[index][field] = value;
    setList(updated);
  };

  const removeItem = (list, setList, index) => {
    const updated = [...list];
    updated.splice(index, 1);
    setList(updated);
  };

  const accountFields = [
    {label: 'Name', value: name, setter: setName},
    {label: 'Email', value: email, setter: setEmail},
    {label: 'Password', value: password, setter: setPassword},
    {label: 'Age', value: age, setter: setAge},
    //{label: 'Gender', value: gender, setter: setGender},
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
    addItem(medications, setMedications, {name: '', time: ''});
  };

  const updateMedication = (index, field, value) => {
    updateItem(medications, setMedications, index, field, value);
  };

  const removeMedication = index => {
    removeItem(medications, setMedications, index);
  };

  // -- MEDICAL CONDITIONS STATE --//
  const addCondition = () => {
    setMedicalConditions([...medicalConditions, '']);
  };

  const updateCondition = (index, value) => {
    onChangeField(medicalConditions, setMedicalConditions, index, value);
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
    onChangeField(dietaryRestrictions, setDietaryRestrictions, index, value);
  };

  const removeDietaryRestriction = index => {
    const updated = [...dietaryRestrictions];
    updated.splice(index, 1);
    setDietaryRestrictions(updated);
  };

  // --ON REGISTRATION--//

  const validateAccountInfo = () => {
    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    }
    if (!age.trim()) {
      newErrors.age = 'Age is required.';
    }
    if (!gender.trim()) {
      newErrors.gender = 'Gender is required.';
    }
    if (!dailyCalories.trim()) {
      newErrors.dailyCalories = 'Daily Calories is required.';
    }

    if (likedMeals.length < 3) {
      newErrors.likedMeals = 'Select at least 3 liked meals.';
    }
    if (dislikedMeals.length < 3) {
      newErrors.dislikedMeals = 'Select at least 3 disliked meals.';
    }

    contacts.forEach((c, i) => {
      if (!c.name.trim() || !c.phone.trim() || !c.email.trim()) {
        newErrors[`contact${i}`] = `Complete contact #${i + 1}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return (
      name.trim() &&
      email.trim() &&
      password.trim() &&
      age.trim() &&
      gender.trim() &&
      dailyCalories.trim() &&
      likedMeals.length >= 3 &&
      dislikedMeals.length >= 3 &&
      contacts.length > 0 &&
      contacts.every(c => c.name.trim() && c.phone.trim() && c.email.trim())
    );
  };

  // Inside your component
  const handleRegistration = async () => {
    if (!validateAccountInfo()) {
      return;
    }

    const registrationData = {
      name: name,
      email: email,
      password: password,
      age: age,
      gender: gender,
      dailyCalories: parseInt(dailyCalories, 10) || undefined,
      dietaryRestrictions: dietaryRestrictions,
      likedRecipes: likedMeals,
      dislikedRecipes: dislikedMeals,
      emergencyContacts: contacts.map(contact => ({
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        fcmTokens: [],
      })),
      medications: medications.map(med => ({
        id: med.id || Date.now().toString(),
        name: med.name,
        time: med.time,
        frequency: med.frequency,
      })),
      medicalConditions: medicalConditions,
      fcmTokens: fcmToken ? [fcmToken] : [],
    };

    try {
      const response = await fetch('http://10.0.2.2:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Registration completed!');
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

  return (
    <ScrollView style={styles.container}>
      {/* ACCOUNT INFO */}
      <Text style={styles.sectionTitle}>Account Information</Text>

      {accountFields.map(({label, value, setter}) => (
        <React.Fragment key={label}>
          {/* Show label above field if it's filled */}
          {value.trim().length > 0 && (
            <Text style={styles.inputLabel}>{label}</Text>
          )}
          <TextInput
            placeholder={label}
            style={[
              styles.input,
              focusedField === label && {
                borderColor: '#007bff',
                borderWidth: 2,
              },
            ]}
            value={value}
            onChangeText={text => setter(text)}
            secureTextEntry={label === 'Password'}
            keyboardType={
              label === 'Email'
                ? 'email-address'
                : label === 'Age' || label === 'Daily Calories'
                ? 'numeric'
                : 'default'
            }
            onFocus={() => setFocusedField(label)}
            onBlur={() => setFocusedField('')}
          />

          {!value.trim() && (
            <Text style={{color: 'red', marginLeft: 5, marginBottom: 10}}>
              ⚠️ {label} is required.
            </Text>
          )}
        </React.Fragment>
      ))}
      <Text style={[styles.label, {marginBottom: 5}]}>Gender</Text>
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        {['Male', 'Female'].map(option => (
          <TouchableOpacity
            key={option}
            onPress={() => setGender(option)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 20,
            }}>
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: gender === option ? '#007BFF' : '#ccc',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 6,
              }}>
              {gender === option && (
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: '#007BFF',
                  }}
                />
              )}
            </View>
            <Text style={{fontSize: 16, color: '#333'}}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {!gender && (
        <Text style={{color: 'red', marginLeft: 5, marginBottom: 10}}>
          Gender is required.
        </Text>
      )}

      {/* MEALS SECTION */}
      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
        <Text style={styles.sectionTitle}>Liked Meals</Text>
        <View
          style={{
            marginLeft: 8,
            backgroundColor: likedMeals.length >= 3 ? '#1976d2' : '#90caf9', // green or red
            borderRadius: 12,
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>
            {likedMeals.length}
          </Text>
        </View>
      </View>
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
            type="like"
          />
        )}
      />
      {errors.likedMeals && (
        <Text style={{color: 'red', marginLeft: 5, marginTop: 5}}>
          ⚠️ {errors.likedMeals}
        </Text>
      )}

      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
        <Text style={styles.sectionTitle}>disliked Meals</Text>
        <View
          style={{
            marginLeft: 8,
            backgroundColor: dislikedMeals.length < 3 ? '#ffcc80' : '#f57c00',
            borderRadius: 12,
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>
            {dislikedMeals.length}
          </Text>
        </View>
      </View>

      <FlatList
        data={foodItems}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Bubble
            label={item}
            selected={dislikedMeals.includes(item)}
            onPress={() => {
              toggleMeal(item, false);
            }}
            type="dislike"
          />
        )}
      />
      {errors.dislikedMeals && (
        <Text style={{color: 'red', marginLeft: 5, marginTop: 5}}>
          ⚠️ {errors.dislikedMeals}
        </Text>
      )}

      {/* EMERGENCY CONTACTS */}
      <Text style={styles.sectionTitle}>Emergency Contacts (At least 1)</Text>
      <EmergencyContacts contacts={contacts} setContacts={setContacts} />

      {/* MEDICATIONS */}
      <Text style={styles.sectionTitle}>Medications</Text>
      {medications.map((med, index) => (
        <React.Fragment key={index}>
          <TextInput
            style={[
              styles.input,
              focusedField === `medName${index}` && {
                borderColor: '#007bff',
                borderWidth: 2,
              },
            ]}
            placeholder="Medication Name"
            value={med.name}
            onChangeText={text => updateMedication(index, 'name', text)}
            onFocus={() => setFocusedField(`medName${index}`)}
            onBlur={() => setFocusedField('')}
          />

          <TouchableOpacity
            style={styles.setTimeButton}
            onPress={() => setExpandedMedIndex(index)}>
            <Text style={styles.setTimeButtonText}>
              {med.time ? `Time: ${med.time}` : 'Set Time of Intake'}
            </Text>
          </TouchableOpacity>

          {expandedMedIndex === index && (
            <View style={styles.timePickerContainer}>
              {/* Manual Time Inputs */}
              <View style={styles.manualTimeRow}>
                <Text>Hour (00-23):</Text>
                <TextInput
                  style={styles.timeInput}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="hh"
                  value={medicationTime[index]?.hour || ''}
                  onChangeText={text =>
                    setMedicationTime(prev => ({
                      ...prev,
                      [index]: {...prev[index], hour: text},
                    }))
                  }
                />
                <Text style={{marginLeft: 10}}>Minute (00-59):</Text>
                <TextInput
                  style={styles.timeInput}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="mm"
                  value={medicationTime[index]?.minute || ''}
                  onChangeText={text =>
                    setMedicationTime(prev => ({
                      ...prev,
                      [index]: {...prev[index], minute: text},
                    }))
                  }
                />
              </View>

              {/* Frequency Buttons */}
              <View style={styles.frequencyRow}>
                {['daily', 'weekly', 'monthly'].map(freq => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.freqButton,
                      medicationTime[index]?.freq === freq &&
                        styles.freqButtonSelected,
                    ]}
                    onPress={() =>
                      setMedicationTime(prev => ({
                        ...prev,
                        [index]: {...prev[index], freq},
                      }))
                    }>
                    <Text
                      style={{
                        color:
                          medicationTime[index]?.freq === freq
                            ? '#fff'
                            : '#000',
                      }}>
                      {freq}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Save Time Button */}
              <TouchableOpacity
                style={styles.saveTimeBtn}
                onPress={() => {
                  const t = medicationTime[index];
                  const validHour =
                    t?.hour &&
                    /^\d{2}$/.test(t.hour) &&
                    parseInt(t.hour) >= 0 &&
                    parseInt(t.hour) <= 23;
                  const validMinute =
                    t?.minute &&
                    /^\d{2}$/.test(t.minute) &&
                    parseInt(t.minute) >= 0 &&
                    parseInt(t.minute) <= 59;

                  if (validHour && validMinute && t?.freq) {
                    const formattedTime = `${t.hour}:${t.minute}`;
                    updateMedication(index, 'time', formattedTime);
                    updateMedication(index, 'frequency', t.freq);
                    setExpandedMedIndex(null);
                  } else {
                    alert(
                      'Please enter a valid time (00-23 for hour and 00-59 for minute) and select frequency.',
                    );
                  }
                }}>
                <Text style={{color: '#fff'}}>Save Time</Text>
              </TouchableOpacity>
            </View>
          )}

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
            style={[
              styles.input,
              focusedField === `condition${index}` && {
                borderColor: '#007bff',
                borderWidth: 2,
              },
            ]}
            placeholder="Condition Name"
            value={condition.name}
            onChangeText={text => updateCondition(index, text)}
            onFocus={() => setFocusedField(`condition${index}`)}
            onBlur={() => setFocusedField('')}
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
      {dietaryRestrictions.map((restriction, index) => (
        <React.Fragment key={index}>
          <TextInput
            style={[
              styles.input,
              focusedField === `restriction${index}` && {
                borderColor: '#007bff',
                borderWidth: 2,
              },
            ]}
            placeholder="Restriction"
            value={restriction}
            onChangeText={text => updateDietaryRestriction(index, text)}
            onFocus={() => setFocusedField(`restriction${index}`)}
            onBlur={() => setFocusedField('')}
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
        style={[
          styles.registerButton,
          {backgroundColor: isFormValid() ? '#007bff' : '#999'},
        ]}
        onPress={handleRegistration}
        disabled={!isFormValid()}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegistrationForm;
