import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  View,
} from 'react-native';
import styles from '../Styles/HomeStylesheet';
import GlucoseReading from '../Components/GlucoseReading';
import Header from '../Components/Header';
import HomeMealContainer from '../Components/HomeMealContainer';
import HomeMedicationCard from '../Components/HomeMedicationCard';
const NewHome = ({navigation}) => {
  return (
    <ScrollView style={styles.header}>
      <Header navigation={navigation} initials={'AA'} />
      <View style={styles.container}>
        <GlucoseReading glucoseReading={70} trend="falling" />
        <HomeMealContainer />
        <HomeMedicationCard />
      </View>
    </ScrollView>
  );
};

export default NewHome;
