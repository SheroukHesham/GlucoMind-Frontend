import React, {useState, useEffect} from 'react';
import {ScrollView, View} from 'react-native';
import styles from '../Styles/HomeStylesheet';
import GlucoseReading from '../components/GlucoseReading';
import Header from '../components/Header';
import MealPlan from '../components/MealPlan';
import MedicationIntake from '../components/MedicationIntake';
import {useUser} from '../contexts/userContext';
import {INavigation} from '../interfaces';
import {TTrend} from '../types';

const NewHome = ({navigation}: INavigation) => {
  const context = useUser();
  const user = context?.user;

  // State for glucose level and trend
  const [glucoseLevel, setGlucoseLevel] = useState<number>();
  const [trend, setTrend] = useState<TTrend>('steady');

  const initials = user?.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const MEDICATIONS = user?.medications || [];

  // Poll glucose data every 4 seconds
  useEffect(() => {
    if (!user || !user._id) {
      return;
    }
    const fetchGlucoseData = async () => {
      // Fetch current CGM reading (glucose level and trend)
      await fetch(`http://10.0.2.2:3000/cgm/current/${user._id}`)
        .then(res => res.json())
        .then(current => {
          if (!current.error) {
            setGlucoseLevel(() => current.glucoseLevels ?? 80);
            setTrend(() => current.trend ?? 'steady');
          } else {
            console.error(current.error);
          }
        })
        .catch(err => {
          console.error('Failed to fetch current CGM reading:', err);
        });
    }; // initial fetch
    fetchGlucoseData();
  }, [user]);

  return (
    <ScrollView className="">
      <Header navigation={navigation} initials={initials} />
      <View style={styles.container}>
        <GlucoseReading glucoseReading={glucoseLevel} trend={trend} />
        <MealPlan navigation={navigation} />
        <MedicationIntake
          showButton={false}
          medications={MEDICATIONS}
          navigation={navigation}
        />
      </View>
    </ScrollView>
  );
};

export default NewHome;
