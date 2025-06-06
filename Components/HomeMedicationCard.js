/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';

import styles from '../Styles/HomeMedicationCard';

// TODO: Replace with real backend data
const MEDICATIONS = [
  {id: '1', name: 'Metformin', time: '8:00 AM'},
  {id: '2', name: 'Insulin (Lantus)', time: '12:00 PM'},
  {id: '3', name: 'Atorvastatin', time: '9:00 PM'},
];

const MedicationIntake = () => {
  const [takenMeds, setTakenMeds] = useState([]);
  const prevTakenRef = useRef([]);

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
      <Text style={styles.title}>Medication Intake</Text>
      <FlatList
        data={MEDICATIONS}
        keyExtractor={item => item.id}
        renderItem={renderMedCard}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </View>
  );
};

export default MedicationIntake;
