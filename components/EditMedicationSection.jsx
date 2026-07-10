/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
// Components/MedicationSection.js
import React from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import styles from '../Styles/RegistrationStylesheet';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import {PermissionsAndroid, Platform} from 'react-native';

const MedicationSection = ({
  userId,
  focusedField,
  setFocusedField,
  medications,
  setMedications,
  expandedMedIndex,
  setExpandedMedIndex,
  medicationTime,
  setMedicationTime,
  edit,
  setEdit,
}) => {
  const [originalMedications, setOriginalMedications] = React.useState([]);

  React.useEffect(() => {
    setOriginalMedications(medications);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medications]);

  const onChangeField = (list, setList, index, value) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };

  // Generic helper functions for managing lists
  const addItem = (list, setList, newItem) => {
    setList([...list, newItem]);
  };

  const updateItem = (list, setList, index, field, value) => {
    const updated = [...list];
    updated[index][field] = value;
    setList(updated);
  };

  const removeItem = (list, setList, index) => {
    const updated = [...list];
    updated.splice(index, 1);
    setList(updated);
  };

  const addMedication = () => {
    addItem(medications, setMedications, {name: '', time: ''});
  };

  const updateMedication = (index, field, value) => {
    updateItem(medications, setMedications, index, field, value);
  };

  const removeMedication = index => {
    removeItem(medications, setMedications, index);
  };

  // request calendar permissions on Android
  const requestCalendarPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
          {
            title: 'Calendar Permission',
            message:
              'GlucoMind needs access to your calendar to set medication reminders.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        const grantedRead = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
          {
            title: 'Calendar Permission',
            message:
              'GlucoMind needs access to your calendar to set medication reminders.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return (
          granted === PermissionsAndroid.RESULTS.GRANTED &&
          grantedRead === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // update user's medications in backend
  const handleSave = async () => {
    const hasPermission = await requestCalendarPermission();
    if (!hasPermission) {
      alert('Calendar permission is required to set reminders.');
      return;
    }

    // Save new user medications to backend
    try {
      const response = await fetch(
        `http://10.0.2.2:3001/user/${userId}/medications`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({medications}),
        },
      );
      const data = await response.json();
      if (response.ok) {
        console.log('Medications saved successfully:', data);
      } else {
        console.error('Error saving medications:', data);
        alert('Failed to save medications.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving medications.');
    }

    // Helper to compare medications (by name, time, frequency)
    const medKey = med => `${med.name}|${med.time}|${med.frequency}`;
    const originalMap = new Map();
    originalMedications.forEach(med => {
      originalMap.set(med.name, med);
    });
    const newMap = new Map();
    medications.forEach(med => {
      newMap.set(med.name, med);
    });

    // 1. Create or update events for new/updated medications
    for (let i = 0; i < medications.length; i++) {
      const med = medications[i];
      if (!med.name || !med.time) {
        continue;
      }
      const orig = originalMap.get(med.name);
      const isNew = !orig;
      const isUpdated = orig && medKey(orig) !== medKey(med);
      if (isNew || isUpdated) {
        // Parse hour and minute from time string (format: 'hh:mm')
        const [hour, minute] = med.time.split(':').map(Number);
        const now = new Date();
        let eventDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hour,
          minute,
          0,
        );
        if (eventDate < now) {
          eventDate.setDate(eventDate.getDate() + 1);
        }
        let recurrence;
        if (med.frequency === 'daily') {
          recurrence = 'daily';
        } else if (med.frequency === 'weekly') {
          recurrence = 'weekly';
        } else if (med.frequency === 'monthly') {
          recurrence = 'monthly';
        }
        const eventConfig = {
          title: `Take Medication: ${med.name}`,
          startDate: eventDate.toISOString(),
          endDate: new Date(eventDate.getTime() + 30 * 60 * 1000).toISOString(),
          notes: 'Medication reminder set by GlucoMind',
          recurrence,
        };
        try {
          await AddCalendarEvent.presentEventCreatingDialog(eventConfig);
          console.log(
            `Calendar event created/updated for medication: ${med.name}`,
          );
        } catch (e) {
          console.error('Error creating/updating calendar event:', e);
        }
      }
    }

    // 2. Delete events for removed medications
    for (let i = 0; i < originalMedications.length; i++) {
      const orig = originalMedications[i];
      if (!newMap.has(orig.name)) {
        try {
          // ask the user to manually delete the old calendar event as it is not supported by the library
          console.log(
            `Medication removed: ${orig.name}. Please delete the calendar event manually if needed.`,
          );
        } catch (e) {
          console.error('Error deleting calendar event:', e);
        }
      }
    }
    setOriginalMedications(medications);
    setEdit(false); // close edit view
  };

  return (
    <>
      {medications.map((med, index) => (
        <React.Fragment key={index}>
          <TextInput
            style={[
              styles.input,
              focusedField === `medName${index}` && {
                borderColor: '#007bff',
                borderWidth: 2,
              },
            ]}
            placeholder="Medication Name"
            value={med.name}
            onChangeText={text => updateMedication(index, 'name', text)}
            onFocus={() => setFocusedField(`medName${index}`)}
            onBlur={() => setFocusedField('')}
          />

          <TouchableOpacity
            style={styles.setTimeButton}
            onPress={() => setExpandedMedIndex(index)}>
            <Text style={styles.setTimeButtonText}>
              {med.time ? `Time: ${med.time}` : 'Set Time of Intake'}
            </Text>
          </TouchableOpacity>

          {expandedMedIndex === index && (
            <View style={styles.timePickerContainer}>
              {/* Manual Time Inputs */}
              <View style={styles.manualTimeRow}>
                <Text>Hour (00-23):</Text>
                <TextInput
                  style={styles.timeInput}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="hh"
                  value={medicationTime[index]?.hour || ''}
                  onChangeText={text =>
                    setMedicationTime(prev => ({
                      ...prev,
                      [index]: {...prev[index], hour: text},
                    }))
                  }
                />
                <Text style={{marginLeft: 10}}>Minute (00-59):</Text>
                <TextInput
                  style={styles.timeInput}
                  keyboardType="numeric"
                  maxLength={2}
                  placeholder="mm"
                  value={medicationTime[index]?.minute || ''}
                  onChangeText={text =>
                    setMedicationTime(prev => ({
                      ...prev,
                      [index]: {...prev[index], minute: text},
                    }))
                  }
                />
              </View>

              {/* Frequency Buttons */}
              <View style={styles.frequencyRow}>
                {['daily', 'weekly', 'monthly'].map(freq => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.freqButton,
                      medicationTime[index]?.freq === freq &&
                        styles.freqButtonSelected,
                    ]}
                    onPress={() =>
                      setMedicationTime(prev => ({
                        ...prev,
                        [index]: {...prev[index], freq},
                      }))
                    }>
                    <Text
                      style={{
                        color:
                          medicationTime[index]?.freq === freq
                            ? '#fff'
                            : '#000',
                      }}>
                      {freq}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Save Time Button */}
              <TouchableOpacity
                style={styles.saveTimeBtn}
                onPress={() => {
                  const t = medicationTime[index];
                  const validHour =
                    t?.hour &&
                    /^\d{2}$/.test(t.hour) &&
                    parseInt(t.hour, 10) >= 0 &&
                    parseInt(t.hour, 10) <= 23;
                  const validMinute =
                    t?.minute &&
                    /^\d{2}$/.test(t.minute) &&
                    parseInt(t.minute, 10) >= 0 &&
                    parseInt(t.minute, 10) <= 59;

                  if (validHour && validMinute && t?.freq) {
                    const formattedTime = `${t.hour}:${t.minute}`;
                    updateMedication(index, 'time', formattedTime);
                    updateMedication(index, 'frequency', t.freq);
                    setExpandedMedIndex(null);
                  } else {
                    alert(
                      'Please enter a valid time (00-23 for hour and 00-59 for minute) and select frequency.',
                    );
                  }
                }}>
                <Text style={{color: '#fff'}}>Save Time</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            onPress={() => removeMedication(index)}
            style={styles.addContainer}>
            <Text style={[styles.plusIcon, {color: '#d00e0e'}]}>-</Text>
            <Text style={[styles.addField, {color: '#d00e0e'}]}>
              Remove Medication
            </Text>
          </TouchableOpacity>
        </React.Fragment>
      ))}
      <TouchableOpacity onPress={addMedication} style={styles.addContainer}>
        <Text style={styles.plusIcon}>+</Text>
        <Text style={styles.addField}>Add Medication</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity style={localStyles.generateButton} onPress={handleSave}>
        <Text style={localStyles.generateButtonText}>Save Medications</Text>
      </TouchableOpacity>
    </>
  );
};

const localStyles = StyleSheet.create({
  bottomButtonContainer: {
    alignItems: 'center',
    margin: 30,
  },
  generateButton: {
    backgroundColor: '#0f9013',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 20,
    margin: 30,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default MedicationSection;
