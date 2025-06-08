import React from 'react';
import {ScrollView} from 'react-native';
import MealPlan from '../Components/MealPlan';
import Header from '../Components/Header';
import styles from '../Styles/HomeStylesheet';

const MealPlanScreen = ({navigation}) => {
  return (
    <ScrollView style={styles.header} nestedScrollEnabled={true}>
      <Header navigation={navigation} initials={'AA'} />
      <MealPlan navigation={navigation} showButton={true} />
    </ScrollView>
  );
};

export default MealPlanScreen;
