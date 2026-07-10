import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import {useUser} from '../contexts/userContext';
import styles from '../Styles/HomeMedicationCard';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {ParamListBase} from '@react-navigation/native';

interface IProps {
  showButton: boolean;
  setEdit?: (arg: boolean) => void;
  medications: [{name: string; time: string}] | [];
  navigation: DrawerNavigationProp<ParamListBase, string, undefined>;
}

const MedicationIntake = ({
  showButton,
  setEdit,
  medications,
  navigation,
}: IProps) => {
  const {user} = useUser();
  const [takenMeds, setTakenMeds] = useState<string[]>([]);
  const prevTakenRef = useRef<string[]>([]);
  const MEDICATIONS = medications;

  const toggleTaken = (medName: string) => {
    setTakenMeds(prev =>
      prev.includes(medName)
        ? prev.filter(name => name !== medName)
        : [...prev, medName],
    );
  };

  useEffect(() => {
    const prevTaken = prevTakenRef.current;
    const newlyTaken = takenMeds.filter(med => !prevTaken.includes(med));
    const newlyUntaken = prevTaken.filter(med => !takenMeds.includes(med));

    console.log('Newly taken meds:', newlyTaken);
    console.log('Untaken meds:', newlyUntaken);

    // Example: Send to backend
    // newlyTaken.forEach(name => {
    //   fetch('https://your-backend/api/medications/taken', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({medicationName: name}),
    //   });
    // });

    // newlyUntaken.forEach(name => {
    //   fetch('https://your-backend/api/medications/untaken', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({medicationName: name}),
    //   });
    // });

    prevTakenRef.current = takenMeds;
  }, [takenMeds]);

  const handleEdit = () => {
    // TODO: set the boolean to true to show the edit view
    if (setEdit) {
      setEdit(true);
    }
    // TODO: Trigger backend logic or script

    console.log('Editing');
  };

  const renderMedCard: ListRenderItem<{
    name: string;
    time: string;
  }> = ({item}) => {
    const isTaken = takenMeds.includes(item.name);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.medicationName}>{item.name}</Text>
          <TouchableOpacity onPress={() => toggleTaken(item.name)}>
            <Text
              className={`text-2xl ${isTaken ? 'color-[#4CAF50] ' : 'color-[#aaa]'}`}>
              {isTaken ? '☑️' : '⬜️'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.detailText}>Time: {item.time}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Drawer', {
            params: {user: user},
            screen: 'Medications',
          })
        }>
        <Text style={styles.title}>Medication Intake</Text>
      </TouchableOpacity>
      <FlatList
        scrollEnabled={false}
        data={MEDICATIONS}
        keyExtractor={item => item.name}
        renderItem={renderMedCard}
        contentContainerStyle={localStyles.contentContainerStyle}
      />
      {/* Add an optional edit button */}
      {showButton && (
        <TouchableOpacity
          style={localStyles.generateButton}
          onPress={handleEdit}>
          <Text style={localStyles.generateButtonText}>Edit Medications</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  bottomButtonContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  generateButton: {
    backgroundColor: '#0f9013',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainerStyle: {
    paddingBottom: 20,
  },
});

export default MedicationIntake;
