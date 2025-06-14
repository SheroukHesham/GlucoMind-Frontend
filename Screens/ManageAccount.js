/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Header from '../Components/Header';
import EmergencyContacts from '../Components/EmergencyContacts';
import styles from '../Styles/ManageAccountStyle';
import MealTags from '../Components/MealTags';
import {useUser} from '../contexts/userContext';

const ManageAccountScreen = ({navigation, route}) => {
  const {user, setUser} = useUser();
  const {reloadKey} = route.params || {};

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dailyCalories, setDailyCalories] = useState('');
  const [contacts, setContacts] = useState([
    {
      id: Date.now(),
      name: 'Jane Doe',
      phone: '123456789',
      email: 'jane@example.com',
      isNew: false,
    },
  ]);
  const [likedMeals, setLikedMeals] = useState([]);
  const [dislikedMeals, setDislikedMeals] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [edit, setEdit] = useState(false);
  const [errors, setErrors] = useState({});
  const [newLikedMeal, setNewLikedMeal] = useState('');
  const [newDislikedMeal, setNewDislikedMeal] = useState('');
  const [newDietaryRestriction, setNewDietaryRestriction] = useState('');
  const [newMedicalCondition, setNewMedicalCondition] = useState('');

  // Reset all fields whenever reloadKey changes (forces clean state)
  useEffect(() => {
    setName(user.name || '');
    setAge(user.age || '');
    setEmail(user.email || '');
    setPassword(user.password || '');
    setDailyCalories(user.dailyCalories ? String(user.dailyCalories) : '');
    setContacts(
      user.emergencyContacts && user.emergencyContacts.length > 0
        ? user.emergencyContacts.map((c, idx) => ({
            id: idx + 1,
            name: c.name || '',
            phone: c.phone || '',
            email: c.email || '',
            isNew: false,
          }))
        : [
            {
              id: Date.now(),
              name: '',
              phone: '',
              email: '',
              isNew: false,
            },
          ],
    );
    setLikedMeals(
      user.likedRecipes && user.likedRecipes.length > 0
        ? user.likedRecipes.map((itemName, idx) => ({
            id: idx + 1,
            name: itemName,
          }))
        : [],
    );
    setDislikedMeals(
      user.dislikedRecipes && user.dislikedRecipes.length > 0
        ? user.dislikedRecipes.map((itemName, idx) => ({
            id: idx + 1,
            name: itemName,
          }))
        : [],
    );
    setDietaryRestrictions(
      user.dietaryRestrictions && user.dietaryRestrictions.length > 0
        ? user.dietaryRestrictions.map((itemName, idx) => ({
            id: idx + 1,
            name: itemName,
          }))
        : [],
    );
    setMedicalConditions(
      user.medicalConditions && user.medicalConditions.length > 0
        ? user.medicalConditions.map((itemName, idx) => ({
            id: idx + 1,
            name: itemName,
          }))
        : [],
    );
    setEdit(false);
  }, [
    reloadKey,
    user.name,
    user.age,
    user.email,
    user.password,
    user.dailyCalories,
    user.emergencyContacts,
    user.likedRecipes,
    user.dislikedRecipes,
    user.dietaryRestrictions,
    user.medicalConditions,
  ]);

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
      dailyCalories.trim() &&
      likedMeals.length >= 3 &&
      dislikedMeals.length >= 3 &&
      contacts.length > 0 &&
      contacts.every(c => c.name.trim() && c.phone.trim() && c.email.trim())
    );
  };

  const handleRegistration = async () => {
    if (!validateAccountInfo() || !isFormValid()) {
      Alert.alert('Fill data', 'Ensure all data is filled before saving');
      return;
    }

    // Build updated user object
    const updatedUser = {
      ...user,
      name: name.trim(),
      age: age.trim(),
      email: email.trim(),
      password: password.trim(),
      dailyCalories: dailyCalories.trim(),
      emergencyContacts: contacts.map(c => ({
        name: c.name,
        phone: c.phone,
        email: c.email,
      })),
      likedRecipes: likedMeals.map(m => m.name),
      dislikedRecipes: dislikedMeals.map(m => m.name),
      dietaryRestrictions: dietaryRestrictions.map(m => m.name),
      medicalConditions: medicalConditions.map(m => m.name),
    };

    try {
      const response = await fetch(`http://10.0.2.2:3001/user/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data); // Update user context with new user data
        console.log('User updated successfully:', data);
      } else {
        console.error('Error updating user:', data);
        Alert.alert('Error', 'Failed to update user.');
        return;
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while updating user.');
      return;
    }

    setEdit(false);
  };

  return (
    <ScrollView>
      <Header navigation={navigation} initials={'AA'} />

      <View style={styles.container}>
        <Text style={styles.header}>Manage Account</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, !edit && styles.disabledInput]}
          editable={edit}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.input, !edit && styles.disabledInput]}
          editable={edit}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[styles.input, !edit && styles.disabledInput]}
          editable={edit}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={[styles.input, !edit && styles.disabledInput]}
          editable={edit}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Target Daily Calories</Text>
        <TextInput
          style={[styles.input, !edit && styles.disabledInput]}
          editable={edit}
          value={dailyCalories}
          onChangeText={setDailyCalories}
          keyboardType="numeric"
        />

        {/* Emergency Contacts */}
        <Text style={styles.label}>Emergency Contacts</Text>
        {edit ? (
          <EmergencyContacts contacts={contacts} setContacts={setContacts} />
        ) : (
          contacts.map((c, index) => (
            <View
              key={index}
              style={{
                marginBottom: 10,
                borderWidth: 0.5,
                borderColor: 'grey',
                borderRadius: 7,
                padding: 10,
              }}>
              <Text style={{fontSize: 16}}>👤 {c.name}</Text>
              <Text style={{fontSize: 16}}>📞 {c.phone}</Text>
              <Text style={{fontSize: 16}}>✉️ {c.email}</Text>
            </View>
          ))
        )}

        {/* Liked Meals */}
        <Text style={styles.label}>
          {edit ? 'Liked Meals (at least 3)' : 'Liked Meals'}
        </Text>
        <MealTags
          meals={likedMeals}
          setMeals={setLikedMeals}
          edit={edit}
          newMeal={newLikedMeal}
          setNewMeal={setNewLikedMeal}
          placeholder="Add Liked Meal"
        />

        {/* Disliked Meals */}
        <Text style={styles.label}>
          {edit ? 'Disliked Meals (at least 3)' : 'Disliked Meals'}
        </Text>
        <MealTags
          meals={dislikedMeals}
          setMeals={setDislikedMeals}
          edit={edit}
          newMeal={newDislikedMeal}
          setNewMeal={setNewDislikedMeal}
          placeholder="Add Disliked Meal"
        />

        <Text style={styles.label}>Dietary Restrictions</Text>
        <MealTags
          meals={dietaryRestrictions}
          setMeals={setDietaryRestrictions}
          edit={edit}
          newMeal={newDietaryRestriction}
          setNewMeal={setNewDietaryRestriction}
          placeholder="Add Dietary Restriction"
        />

        <Text style={styles.label}>Medical Conditions</Text>
        <MealTags
          meals={medicalConditions}
          setMeals={setMedicalConditions}
          edit={edit}
          newMeal={newMedicalCondition}
          setNewMeal={setNewMedicalCondition}
          placeholder="Add a Medical Condition"
        />

        {edit ? (
          <TouchableOpacity style={styles.button} onPress={handleRegistration}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => setEdit(true)}>
            <Text style={styles.buttonText}>Edit Account</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default ManageAccountScreen;
