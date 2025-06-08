/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import MedicationIntake from '../Components/MedicationIntake';
import Header from '../Components/Header';
import styles from '../Styles/HomeStylesheet';
import MedicationSection from '../Components/EditMedicationSection';

const MedicationsScreen = ({navigation}) => {
  // TODO: Replace with real backend data
  const MEDICATIONS = [
    {id: '1', name: 'Metformin', time: '8:00 AM'},
    {id: '2', name: 'Insulin (Lantus)', time: '12:00 PM'},
    {id: '3', name: 'Atorvastatin', time: '9:00 PM'},
  ];

  const [edit, setEdit] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [medications, setMedications] = useState(MEDICATIONS);
  const [expandedMedIndex, setExpandedMedIndex] = useState(null);
  const [medicationTime, setMedicationTime] = useState({});

  return (
    <ScrollView style={styles.header} nestedScrollEnabled={true}>
      <Header navigation={navigation} initials={'AA'} />
      {/* Show Medications to be taken only if edit is false */}
      {!edit && (
        <View style={{marginTop: 15}}>
          <MedicationIntake
            showButton={true}
            edit={edit}
            setEdit={setEdit}
            medications={medications}
          />
        </View>
      )}
      {/* Show medication editing and saving if edit is true */}
      {edit && (
        <View style={styles.container}>
          <MedicationSection
            focusedField={focusedField}
            setFocusedField={setFocusedField}
            medications={medications}
            setMedications={setMedications}
            expandedMedIndex={expandedMedIndex}
            setExpandedMedIndex={setExpandedMedIndex}
            medicationTime={medicationTime}
            setMedicationTime={setMedicationTime}
            edit={edit}
            setEdit={setEdit}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default MedicationsScreen;
