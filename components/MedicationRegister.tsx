import React, {useState} from 'react';
import {Text, TextInput} from 'react-native-gesture-handler';
import {IUser} from '../interfaces';
import {TouchableOpacity} from 'react-native';
import {View} from 'react-native-reanimated/lib/typescript/Animated';
import styles from '../Styles/RegistrationStylesheet';

interface IProps {
  newUser: IUser;
  setNewUser: (arg: IUser) => void;
}

const MedicationRegister = ({newUser, setNewUser}: IProps) => {
  const [expandedMedIndex, setExpandedMedIndex] = useState<number>();
  const [focusedField, setFocusedField] = useState('');
  return (
    <>
      {/* MEDICATIONS */}
      <Text style={styles.sectionTitle}>Medications</Text>
      {newUser.medications.map((med, index) => (
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
            //TODO: implement new
            // onChangeText={text => updateMedication(index, 'name', text)}
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
                      medicationTime[index]?.freq === freq
                        ? styles.freqButtonSelected
                        : null,
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
    </>
  );
};

export default MedicationRegister;
