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
import EmergencyContacts from '../components/EmergencyContacts';
import {foodItems} from '../data';
import {INavigation, IUser} from '../interfaces';
import MedicationRegister from '../components/MedicationRegister';

interface IBubble {
  label: string;
  selected: boolean;
  onPress: () => void;
  type: 'like' | 'dislike';
}

const Bubble = ({label, selected, onPress, type}: IBubble) => {
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
      className={`my-2 py-2 px-4 rounded-full border-2 border-[#007AFF] mr-3 ${selected ? 'border-[#CCC]' : 'border-transparent'}`}
      style={{backgroundColor: backgroundColor}}>
      <Text style={[styles.bubbleText, {color: textColor}]}>
        {emoji} {label}
      </Text>
    </TouchableOpacity>
  );
};

const RegistrationForm = ({navigation}: INavigation) => {
  const defaultUser: IUser = {
    email: '',
    password: '', // Store hashed password
    name: '',
    fcmTokens: [],
    age: '',
    gender: '',
    emergencyContacts: [
      {
        name: '',
        phone: '',
        email: '',
        fcmTokens: [], // optional, if contact has app and FCM tokens
      },
    ],
    dietaryRestrictions: [],
    dailyCalories: 0,
    medications: [{name: '', time: ''}],
    likedRecipes: [],
    dislikedRecipes: [],
    medicalConditions: [],
  };

  const [newUser, setNewUser] = useState<IUser>(defaultUser);
  const [focusedField, setFocusedField] = useState('');

  const [errors, setErrors] = useState();

  const {fcmToken, setUser} = useUser();

  // TODO: add validations

  // useEffect(() => {
  //   let updatedErrors = {...errors};

  //   if (newUser?.likedRecipes.length < 3) {
  //     updatedErrors.likedRecipes = 'Select at least 3 liked meals.';
  //   } else {
  //     delete updatedErrors.likedRecipes;
  //   }

  //   if (dislikedRecipes.length < 3) {
  //     updatedErrors.dislikedRecipes = 'Select at least 3 disliked meals.';
  //   } else {
  //     delete updatedErrors.dislikedRecipes;
  //   }

  //   const isDifferent =
  //     JSON.stringify(errors) !== JSON.stringify(updatedErrors);
  //   if (isDifferent) {
  //     setErrors(updatedErrors);
  //   }
  // }, [likedRecipes, dislikedRecipes, errors]);

  // const onChangeField = (list, setList, index, value) => {
  //   const updated = [...list];
  //   updated[index] = value;
  //   setList(updated);
  // };

  // // Generic helper functions for managing lists
  // const addItem = (list, setList, newItem) => {
  //   setList([...list, newItem]);
  // };

  // const updateItem = (list, setList, index, field, value) => {
  //   const updated = [...list];
  //   updated[index][field] = value;
  //   setList(updated);
  // };

  // const removeItem = (list, setList, index) => {
  //   const updated = [...list];
  //   updated.splice(index, 1);
  //   setList(updated);
  // };

  const accountFields = [
    {label: 'Name', value: name, setter: setName},
    {label: 'Email', value: email, setter: setEmail},
    {label: 'Password', value: password, setter: setPassword},
    {label: 'Age', value: age, setter: setAge},
    {label: 'Daily Calories', value: dailyCalories, setter: setDailyCalories},
  ];

  //TODO:Refactor
  const toggleMeal = (meal: string, isLiked: boolean) => {
    if (isLiked) {
      // Remove from dislikes if present
      if (newUser?.dislikedRecipes.includes(meal)) {
        const filtered = newUser.dislikedRecipes.filter(m => m !== meal);
        setNewUser({...newUser, dislikedRecipes: filtered});
      }
      // Toggle like
      if (newUser?.likedRecipes.includes(meal)) {
        const filtered = newUser.likedRecipes.filter(m => m !== meal);
        setNewUser({...newUser, likedRecipes: filtered});
      } else {
        const liked = newUser?.likedRecipes;
        liked?.push(meal);
        setNewUser({...newUser, likedRecipes: liked});
      }
    } else {
      // Remove from likes if present
      if (newUser?.likedRecipes.includes(meal)) {
        const filtered = newUser.likedRecipes.filter(m => m !== meal);
        setNewUser({...newUser, likedRecipes: filtered});
      }
      // Toggle dislike
      if (newUser?.dislikedRecipes.includes(meal)) {
        const filtered = newUser.dislikedRecipes.filter(m => m !== meal);
        setNewUser({...newUser, dislikedRecipes: filtered});
      } else {
        const disliked = newUser?.dislikedRecipes;
        disliked?.push(meal);
        setNewUser({...newUser, likedRecipes: disliked});
      }
    }
  };

  // --ON REGISTRATION--//

  // const validateAccountInfo = () => {
  //   const {name} = newUser;
  //   let newErrors = {};

  //   if (!name.trim()) {
  //     newErrors.name = 'Name is required.';
  //   }
  //   if (!email.trim()) {
  //     newErrors.email = 'Email is required.';
  //   }
  //   if (!password.trim()) {
  //     newErrors.password = 'Password is required.';
  //   }
  //   if (!age.trim()) {
  //     newErrors.age = 'Age is required.';
  //   }
  //   if (!gender.trim()) {
  //     newErrors.gender = 'Gender is required.';
  //   }
  //   if (!dailyCalories.trim()) {
  //     newErrors.dailyCalories = 'Daily Calories is required.';
  //   }

  //   if (likedRecipes.length < 3) {
  //     newErrors.likedRecipes = 'Select at least 3 liked meals.';
  //   }
  //   if (dislikedRecipes.length < 3) {
  //     newErrors.dislikedRecipes = 'Select at least 3 disliked meals.';
  //   }

  //   contacts.forEach((c, i) => {
  //     if (!c.name.trim() || !c.phone.trim() || !c.email.trim()) {
  //       newErrors[`contact${i}`] = `Complete contact #${i + 1}`;
  //     }
  //   });

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const isFormValid = () => {
  //   return (
  //     name.trim() &&
  //     email.trim() &&
  //     password.trim() &&
  //     age.trim() &&
  //     gender.trim() &&
  //     dailyCalories.trim() &&
  //     likedRecipes.length >= 3 &&
  //     dislikedRecipes.length >= 3 &&
  //     contacts.length > 0 &&
  //     contacts.every(c => c.name.trim() && c.phone.trim() && c.email.trim())
  //   );
  // };

  // Inside your component
  const handleRegistration = async () => {
    // if (!validateAccountInfo()) {
    //   return;
    // }

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
      <Text className="mb-1">Gender</Text>
      <View className="flex mb-2">
        {['Male', 'Female'].map(option => (
          <TouchableOpacity
            key={option}
            onPress={() => setNewUser({...newUser, gender: option})}
            className="flex items-center mr-5">
            <View
              className={`h-5 w-5 rounded-lg border-2 flex items-center justify-center mr-2 ${newUser.gender === option ? 'border-[#007BFF]' : 'border-[]#ccc'}`}>
              {newUser.gender === option && (
                <View className="h-3 w-3 rounded-md bg-[#007BFF]" />
              )}
            </View>
            <Text className="color-[#333]">{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {!newUser.gender && (
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
            backgroundColor:
              newUser.likedRecipes.length >= 3 ? '#1976d2' : '#90caf9', // green or red
            borderRadius: 12,
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>
            {newUser.likedRecipes.length}
          </Text>
        </View>
      </View>
      <FlatList
        data={foodItems}
        numColumns={3}
        showsVerticalScrollIndicator={true}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Bubble
            label={item}
            selected={newUser.likedRecipes.includes(item)}
            onPress={() => {
              toggleMeal(item, true);
            }}
            type="like"
          />
        )}
        contentContainerStyle={{flexGrow: 1}}
      />
      {errors?.likedRecipes && (
        <Text style={{color: 'red', marginLeft: 5, marginTop: 5}}>
          ⚠️ {errors.likedRecipes}
        </Text>
      )}

      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
        <Text style={styles.sectionTitle}>disliked Meals</Text>
        <View
          style={{
            marginLeft: 8,
            backgroundColor:
              newUser.dislikedRecipes.length < 3 ? '#ffcc80' : '#f57c00',
            borderRadius: 12,
            width: 24,
            height: 24,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>
            {newUser.dislikedRecipes.length}
          </Text>
        </View>
      </View>

      <FlatList
        data={foodItems}
        numColumns={3}
        showsVerticalScrollIndicator={true}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Bubble
            label={item}
            selected={newUser.dislikedRecipes.includes(item)}
            onPress={() => {
              toggleMeal(item, false);
            }}
            type="dislike"
          />
        )}
        contentContainerStyle={{flexGrow: 1}}
      />
      {errors.dislikedRecipes && (
        <Text style={{color: 'red', marginLeft: 5, marginTop: 5}}>
          ⚠️ {errors.dislikedRecipes}
        </Text>
      )}

      {/* EMERGENCY CONTACTS */}
      <Text style={styles.sectionTitle}>Emergency Contacts (At least 1)</Text>
      {/* //TODO:Fix */}
      {/* <EmergencyContacts
        contacts={newUser.emergencyContacts}
        setNewUser={setNewUser}
      /> */}

      {/* //TODO: Fix */}
      {/* <MedicationRegister newUser={newUser} setNewUser={setNewUser}/> */}

      {/* MEDICAL CONDITIONS */}
      <Text style={styles.sectionTitle}>Other Medical Conditions</Text>
      {newUser.medicalConditions.map((condition, index) => (
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
            value={condition}
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
