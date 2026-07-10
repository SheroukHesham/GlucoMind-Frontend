/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import MedicationIntake from '../components/MedicationIntake';
import Header from '../components/Header';
import styles from '../Styles/HomeStylesheet';
import MedicationSection from '../components/EditMedicationSection';
import {useUser} from '../contexts/userContext';

const MedicationsScreen = ({navigation, route}) => {
  const {user} = useUser();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AA';

  // TODO: Replace with real backend data
  const MEDICATIONS = user?.medications || [];

  const [edit, setEdit] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [medications, setMedications] = useState(MEDICATIONS);
  const [expandedMedIndex, setExpandedMedIndex] = useState(null);
  const [medicationTime, setMedicationTime] = useState({});

  return (
    <ScrollView style={styles.header} nestedScrollEnabled={true}>
      <Header navigation={navigation} initials={initials} />
      {/* Show Medications to be taken only if edit is false */}
      {!edit && (
        <View style={{marginTop: 15}}>
          <MedicationIntake
            showButton={true}
            edit={edit}
            setEdit={setEdit}
            medications={medications}
            user={user}
            navigation={navigation}
          />
        </View>
      )}
      {/* Show medication editing and saving if edit is true */}
      {edit && (
        <View style={styles.container}>
          <MedicationSection
            userId={user._id}
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
