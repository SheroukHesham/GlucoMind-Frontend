import React, {useMemo, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';

// 🔧 Generate mock data for the past 7 days, 4 readings/day
const generateMockCGMData = () => {
  const readings = [];
  const now = new Date();

  for (let d = 6; d >= 0; d--) {
    const day = new Date(now);
    day.setDate(now.getDate() - d);

    for (let i = 0; i < 4; i++) {
      const time = new Date(day);
      time.setHours(6 + i * 6);
      readings.push({
        timestamp: time.toISOString(),
        glucose: Math.floor(Math.random() * 160) + 60, // 60–220
      });
    }
  }

  return readings;
};

const CGMChartToggle = () => {
  const [timeRange, setTimeRange] = useState('day'); // 'day' or 'week'
  const mockData = useMemo(generateMockCGMData, []);

  const processedData = useMemo(() => {
    if (timeRange === 'day') {
      const last24h = mockData.slice(-12); // Last 12 readings (~24 hrs)
      return last24h.map(entry => {
        const label = new Date(entry.timestamp).getHours() + ':00';
        const value = entry.glucose;
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
      // Weekly: average glucose per day
      const grouped = {};
      mockData.forEach(entry => {
        const label = new Date(entry.timestamp).toLocaleDateString('en-US', {
          weekday: 'short',
        });
        if (!grouped[label]) grouped[label] = [];
        grouped[label].push(entry.glucose);
      });

      return Object.entries(grouped).map(([label, values]) => {
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
      });
    }
  }, [mockData, timeRange]);

  const allValues = processedData.map(p => p.value);
  const maxY = Math.max(...allValues);
  const minY = Math.min(...allValues);

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
        maxValue={Math.ceil((maxY + 20) / 10) * 10} // pad above top value
        minValue={Math.floor((minY - 20) / 10) * 10} // pad below if needed
      />
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

export default CGMChartToggle;
