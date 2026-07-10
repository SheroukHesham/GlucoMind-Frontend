import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';
import {IUser} from '../interfaces';

interface ICgmData {
  glucoseLevels: number[];
  timestamp: string[];
}

const CGMLineChart = (user: IUser) => {
  const [cgmData, setCgmData] = useState<number[]>([]);
  const [weekdata, setWeekdata] = useState<number[]>([]);
  const [timeRange, setTimeRange] = useState<string>('day');

  useEffect(() => {
    if (!user || !user._id) {
      return;
    }

    const fetchData = () => {
      console.log('Fetching CGM data for user:', user._id);
      fetch(`http://10.0.2.2:3000/cgm/last24h/${user._id}`)
        .then(res => res.json())
        .then(data => setCgmData(data.readings || []))
        .catch(err => console.error('Error fetching 24h CGM data:', err));

      fetch(`http://10.0.2.2:3000/cgm/last7d/${user._id}`)
        .then(res => res.json())
        .then(data => setWeekdata(data.readings || []))
        .catch(err => console.error('Error fetching weekly CGM data:', err));
    };

    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, [user]);

  const processedData = useMemo(() => {
    const now = new Date();
    if (timeRange === 'day') {
      // Filter for last 24 hours, only valid glucoseLevels
      const filtered = cgmData
        .filter(entry => {
          const t = new Date(entry.timestamp);
          return (
            typeof entry.glucoseLevels === 'number' &&
            !isNaN(entry.glucoseLevels) &&
            now - t <= 24 * 60 * 60 * 1000 &&
            now - t >= 0
          );
        })
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      return filtered.map(entry => {
        const date = new Date(entry.timestamp);
        const label = date.getHours().toString().padStart(2, '0') + ':00';
        const value = entry.glucoseLevels;
        return {
          label,
          value,
          dataPointText: `${value}${value < 70 || value > 180 ? ' ⚠' : ''}`,
          dataPointTextStyle: {
            color: value < 70 || value > 180 ? '#d32f2f' : '#333',
            fontWeight: '600',
          },
        };
      });
    } else {
      // Weekly: group by day, only valid glucoseLevels
      const grouped = {};
      weekdata.forEach(entry => {
        if (
          typeof entry.glucoseLevels !== 'number' ||
          isNaN(entry.glucoseLevels)
        ) {
          return;
        }
        const d = new Date(entry.timestamp);
        const label = d.toLocaleDateString('en-US', {weekday: 'short'});
        if (!grouped[label]) {
          grouped[label] = [];
        }
        grouped[label].push(entry.glucoseLevels);
      });
      return Object.entries(grouped)
        .map(([label, values]) => {
          if (!values.length) {
            return null;
          }
          const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
          return {
            label,
            value: Math.round(avg),
            dataPointText: `${Math.round(avg)}${
              avg < 70 || avg > 180 ? ' ⚠' : ''
            }`,
            dataPointTextStyle: {
              color: avg < 70 || avg > 180 ? '#d32f2f' : '#333',
              fontWeight: '600',
            },
          };
        })
        .filter(Boolean);
    }
  }, [cgmData, weekdata, timeRange]);

  const allValues = processedData.map(p => p.value);
  const maxY = allValues.length ? Math.max(...allValues) : 200;
  const minY = allValues.length ? Math.min(...allValues) : 60;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        CGM Readings - {timeRange === 'day' ? 'Past 24 Hours' : 'Past 7 Days'}
      </Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => setTimeRange('day')}
          style={[
            styles.toggleButton,
            timeRange === 'day' && styles.activeToggle,
          ]}>
          <Text
            style={[
              styles.toggleText,
              timeRange === 'day' && styles.activeToggleText,
            ]}>
            Day
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTimeRange('week')}
          style={[
            styles.toggleButton,
            timeRange === 'week' && styles.activeToggle,
          ]}>
          <Text
            style={[
              styles.toggleText,
              timeRange === 'week' && styles.activeToggleText,
            ]}>
            Week
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{width: '100%'}}>
        <LineChart
          data={processedData}
          curved
          areaChart
          color="#d32f2f"
          thickness={3}
          startFillColor="#ff8a80"
          endFillColor="#ff5252"
          startOpacity={0.3}
          endOpacity={0.05}
          hideDataPoints={false}
          dataPointsRadius={4}
          dataPointsColor="#d32f2f"
          showValuesAsDataPointsText
          dataPointsHeight={30}
          yAxisTextStyle={{color: 'gray'}}
          xAxisLabelTextStyle={{color: 'gray', fontSize: 11}}
          rulesColor="#e0e0e0"
          spacing={timeRange === 'day' ? 40 : 50}
          initialSpacing={15}
          showScrollIndicator
          scrollToEnd={true}
          backgroundColor="#fff"
          maxValue={Math.ceil((maxY + 20) / 10) * 10}
          minValue={Math.floor((minY - 20) / 10) * 10}
          width={200} // 32px padding on each side
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeToggle: {
    backgroundColor: '#d32f2f',
  },
  toggleText: {
    color: '#333',
    fontWeight: '500',
  },
  activeToggleText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default CGMLineChart;
