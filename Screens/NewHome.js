import React from 'react';
import {ScrollView, View} from 'react-native';
import styles from '../Styles/HomeStylesheet';
import GlucoseReading from '../Components/GlucoseReading';
import Header from '../Components/Header';
import HomeMealContainer from '../Components/MealPlan';
import MedicationIntake from '../Components/MedicationIntake';

const NewHome = ({navigation}) => {
  // TODO: Replace with real backend data
  const MEDICATIONS = [
    {id: '1', name: 'Metformin', time: '8:00 AM'},
    {id: '2', name: 'Insulin (Lantus)', time: '12:00 PM'},
    {id: '3', name: 'Atorvastatin', time: '9:00 PM'},
  ];
  return (
    <ScrollView style={styles.header}>
      <Header navigation={navigation} initials={'AA'} />
      <View style={styles.container}>
        <GlucoseReading glucoseReading={70} trend="falling" />
        <HomeMealContainer navigation={navigation} />
        <MedicationIntake showButton={false} medications={MEDICATIONS} />
      </View>
    </ScrollView>
  );
};

export default NewHome;
