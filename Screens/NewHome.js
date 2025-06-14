import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import styles from '../Styles/HomeStylesheet';
import GlucoseReading from '../Components/GlucoseReading';
import Header from '../Components/Header';
import HomeMealContainer from '../Components/MealPlan';
import MedicationIntake from '../Components/MedicationIntake';
import {useUser} from '../contexts/userContext';

const NewHome = ({navigation, route}) => {
  const {user} = useUser();

  // State for glucose level and trend
  const [glucoseLevel, setGlucoseLevel] = useState(80);
  const [trend, setTrend] = useState('steady');
  const [highest, setHighest] = useState(null);
  const [lowest, setLowest] = useState(null);
  const [average, setAverage] = useState(null);

  // Example fallback if no user passed
  const initials = user?.name
    ? user.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AA';

  const MEDICATIONS = user?.medications || [];

  // Receive glucose levels and trend through websocket
  const ws = new WebSocket('ws://10.0.2.2:4000');

  ws.onopen = () => {
    console.log('WebSocket connection established');
  };

  ws.onmessage = event => {
    const data = JSON.parse(event.data);
    if (data.trend) {
      // Update state with new glucose level and trend
      setTrend(data.trend);
      setGlucoseLevel(data.glucoseLevel);
      // get average reading, highest reading, and lowest reading
      if (user && user._id) {
        fetch(`http://10.0.2.2:3000/cgm/high-low/${user._id}`)
          .then(res => res.json())
          .then(stats => {
            if (!stats.error) {
              setHighest(stats.highest);
              setLowest(stats.lowest);
              setAverage(stats.averageGlucose);
              console.log('Glucose stats:', stats);
            } else {
              console.error(stats.error);
            }
          })
          .catch(err => {
            console.error('Failed to fetch glucose stats:', err);
          });
      }
    } else if (data.error) {
      // Handle error
      console.error(data.error);
    } else if (data.message) {
      // Initial connection message
      console.log(data.message);
    }
  };

  ws.onerror = error => {
    console.error('WebSocket error:', error);
  };

  return (
    <ScrollView style={styles.header}>
      <Header navigation={navigation} initials={initials} />
      <View style={styles.container}>
        <GlucoseReading
          glucoseReading={glucoseLevel}
          trend={trend}
          avgReading={average}
          highestReading={highest}
          lowestReading={lowest}
        />
        <HomeMealContainer navigation={navigation} user={user} />
        <MedicationIntake
          showButton={false}
          medications={MEDICATIONS}
          user={user}
          navigation={navigation}
        />
      </View>
    </ScrollView>
  );
};

export default NewHome;
