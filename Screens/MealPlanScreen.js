import React from 'react';
import {ScrollView} from 'react-native';
import MealPlan from '../Components/MealPlan';
import Header from '../Components/Header';
import styles from '../Styles/HomeStylesheet';
import {useUser} from '../contexts/userContext';

const MealPlanScreen = ({navigation}) => {
  const {user} = useUser();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AA';
  return (
    <ScrollView style={styles.header} nestedScrollEnabled={true}>
      <Header navigation={navigation} initials={initials} />
      <MealPlan navigation={navigation} showButton={true} user={user} />
    </ScrollView>
  );
};

export default MealPlanScreen;
