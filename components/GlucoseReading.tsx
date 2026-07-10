import React, {useEffect, useState} from 'react';
import {View, Text, StyleProp, ViewStyle} from 'react-native';
import styles from '../Styles/GlucoseReadingStyle';
import CGMLineChart from './CGMLineChart';
import CGMReportPDF from './PDFGenerator';
import {useUser} from '../contexts/userContext';
import {TTrend} from '../types';

interface IProps {
  glucoseReading: number | undefined;
  trend: TTrend;
}

const GlucoseReading = ({glucoseReading, trend}: IProps) => {
  const {user} = useUser();
  const [weekData, setWeekData] = useState([]);

  useEffect(() => {
    if (!user || !user._id) {
      return;
    }
    fetch(`http://localhost:3000/cgm/last7d/${user._id}`)
      .then(res => res.json())
      .then(data => setWeekData(data.readings || []))
      .catch(err => console.error('Error fetching weekly CGM data:', err));
  }, [user]);

  const getBorderColor = (value: number) => {
    // TODO: put actual ranges
    if (value > 80 && value < 120) {
      return '#4CAF50';
    } // green
    if (value < 140) {
      return '#FFC107';
    } // yellow
    return '#F44336'; // red
  };

  const renderTriangle = (color: string) => {
    const baseStyle: StyleProp<ViewStyle> = {
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

    let rotation = '90deg'; // steady

    if (trend === 'rising') {
      rotation = '360deg';
    } else if (trend === 'falling') {
      rotation = '-180deg';
    }

    return <View style={[baseStyle, {transform: [{rotate: rotation}]}]} />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blood Glucose Monitoring</Text>
      <View style={styles.contentRow}>
        <View
          style={[
            styles.glucoseCircle,
            glucoseReading ? {borderColor: getBorderColor(glucoseReading)} : '',
          ]}>
          <Text style={styles.glucoseText}>{glucoseReading} </Text>
          <Text style={styles.glucoseText}>mg/dL </Text>
        </View>
      </View>

      {glucoseReading
        ? renderTriangle(getBorderColor(glucoseReading))
        : renderTriangle(getBorderColor(70))}

      <CGMLineChart user={user} />
      <CGMReportPDF cgmData={weekData} />
    </View>
  );
};

export default GlucoseReading;
