import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import styles from '../Styles/GlucoseReadingStyle';
const GlucoseReading = ({
  glucoseReading,
  trend,
  avgReading,
  highestReading,
  lowestReading,
}) => {
  const getBorderColor = value => {
    if (value < 100) return '#4CAF50'; // green
    if (value < 140) return '#FFC107'; // yellow
    return '#F44336'; // red
  };

  const renderTriangle = (trend, color) => {
    const baseStyle = {
      width: 0,
      height: 0,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderBottomWidth: 15,
      borderStyle: 'solid',
      backgroundColor: 'transparent',
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: color,
      alignSelf: 'center',
    };

    // steady -> falling
    //rising -> steady
    //falling -> rising

    let rotation = '90deg'; // steady

    if (trend === 'rising') rotation = '360deg';
    else if (trend === 'falling') rotation = '-180deg';

    return <View style={[baseStyle, {transform: [{rotate: rotation}]}]} />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blood Glucose Monitoring</Text>
      <View style={styles.contentRow}>
        <View
          style={[
            styles.glucoseCircle,
            {borderColor: getBorderColor(glucoseReading)},
          ]}>
          <Text style={styles.glucoseText}>{glucoseReading} </Text>
          <Text style={styles.glucoseText}>mg/dL </Text>
        </View>
      </View>

      {trend === 'rising'
        ? renderTriangle(trend)
        : trend === 'falling'
        ? renderTriangle(trend, getBorderColor(glucoseReading))
        : renderTriangle(trend, getBorderColor(glucoseReading))}

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>{avgReading ?? '-'}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Highest</Text>
          <Text style={styles.statValue}>{highestReading ?? '-'}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Lowest</Text>
          <Text style={styles.statValue}>{lowestReading ?? '-'}</Text>
        </View>
      </View>
    </View>
  );
};

export default GlucoseReading;
