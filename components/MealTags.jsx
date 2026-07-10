// Components/MealTags.js
import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from '../Styles/ManageAccountStyle';

const MealTags = ({
  meals,
  setMeals,
  edit,
  newMeal,
  setNewMeal,
  placeholder,
}) => {
  return (
    <>
      <View style={styles.bubbleContainer}>
        {meals.map((meal, index) => (
          <View key={meal.id} style={styles.bubble}>
            <Text style={styles.bubbleText}>{meal.name}</Text>
            {edit && (
              <TouchableOpacity
                onPress={() =>
                  setMeals(prev => prev.filter((_, i) => i !== index))
                }
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.removeText}>—</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {edit && (
        <View style={styles.addMealRow}>
          <TextInput
            placeholder={placeholder}
            value={newMeal}
            onChangeText={setNewMeal}
            style={[styles.input, {width: '70%'}]}
          />
          <TouchableOpacity
            onPress={() => {
              if (newMeal.trim()) {
                setMeals(prev => [
                  ...prev,
                  {id: Date.now(), name: newMeal.trim()},
                ]);
                setNewMeal('');
              }
            }}
            style={styles.addButtonSmall}>
            <Text style={styles.addButtonTextSmall}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default MealTags;
