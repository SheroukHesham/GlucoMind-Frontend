/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useUser} from '../contexts/userContext';
import styles from '../Styles/HomeMedicationCard';

const MedicationIntake = ({
  showButton,
  edit,
  setEdit,
  medications,
  navigation,
}) => {
  const {user} = useUser();
  const [takenMeds, setTakenMeds] = useState([]);
  const prevTakenRef = useRef([]);
  const MEDICATIONS = medications;

  const toggleTaken = medName => {
    setTakenMeds(prev =>
      prev.includes(medName)
        ? prev.filter(name => name !== medName)
        : [...prev, medName],
    );
  };

  useEffect(() => {
    const prevTaken = prevTakenRef.current;
    const newlyTaken = takenMeds.filter(med => !prevTaken.includes(med));
    const newlyUntaken = prevTaken.filter(med => !takenMeds.includes(med));

    console.log('Newly taken meds:', newlyTaken);
    console.log('Untaken meds:', newlyUntaken);

    // Example: Send to backend
    // newlyTaken.forEach(name => {
    //   fetch('https://your-backend/api/medications/taken', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({medicationName: name}),
    //   });
    // });

    // newlyUntaken.forEach(name => {
    //   fetch('https://your-backend/api/medications/untaken', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({medicationName: name}),
    //   });
    // });

    prevTakenRef.current = takenMeds;
  }, [takenMeds]);

  const handleEdit = () => {
    // TODO: set the boolean to true to show the edit view
    setEdit(true);
    // TODO: Trigger backend logic or script

    console.log('Editing');
  };

  const renderMedCard = ({item}) => {
    const isTaken = takenMeds.includes(item.name);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.medicationName}>{item.name}</Text>
          <TouchableOpacity onPress={() => toggleTaken(item.name)}>
            <Text style={{fontSize: 24, color: isTaken ? '#4CAF50' : '#aaa'}}>
              {isTaken ? '☑️' : '⬜️'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.detailText}>Time: {item.time}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Drawer', {
            params: {user: user},
            screen: 'Medications',
          })
        }>
        <Text style={styles.title}>Medication Intake</Text>
      </TouchableOpacity>
      <FlatList
        scrollEnabled={false}
        data={MEDICATIONS}
        keyExtractor={item => item.name}
        renderItem={renderMedCard}
        contentContainerStyle={{paddingBottom: 20}}
      />
      {/* Add an optional edit button */}
      {showButton && (
        <TouchableOpacity
          style={localStyles.generateButton}
          onPress={handleEdit}>
          <Text style={localStyles.generateButtonText}>Edit Medications</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  bottomButtonContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  generateButton: {
    backgroundColor: '#0f9013',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default MedicationIntake;
