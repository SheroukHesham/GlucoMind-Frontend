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

const MedicationSection = ({
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

  // TODO: UNCOMMENT DURING INTEGRATION
  const handleSave = async () => {
    // try {
    // // Replace this URL with your actual backend endpoint
    // const response = await fetch(
    //   'http://<YOUR_BACKEND_URL>/medications/update',
    //   {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({medications}), // send the updated medications
    //   },
    // );

    // const data = await response.json();

    // if (response.ok) {
    //   console.log('Medications saved successfully:', data);
    setEdit(false); // close edit view
    //   } else {
    //     console.error('Error saving medications:', data);
    //     alert('Failed to save medications.');
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    //   alert('An error occurred while saving medications.');
    // }
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
                    parseInt(t.hour) >= 0 &&
                    parseInt(t.hour) <= 23;
                  const validMinute =
                    t?.minute &&
                    /^\d{2}$/.test(t.minute) &&
                    parseInt(t.minute) >= 0 &&
                    parseInt(t.minute) <= 59;

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
