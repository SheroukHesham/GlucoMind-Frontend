/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import styles from '../Styles/MealPageStyle';
import Header from '../Components/Header';

const MealDetailsScreen = ({route, navigation}) => {
  const {meal, user} = route.params;
  console.log(meal);

  const [liked, setLiked] = useState(null);

  const handleLike = () => setLiked(true);
  const handleDislike = () => setLiked(false);

  const instructionSteps = meal.instructions
    ? meal.instructions
        .split('.')
        .map(step => step.trim())
        .filter(step => step.length > 0)
    : [];

  return (
    <ScrollView style={{flex: 1}}>
      <Header navigation={navigation} initials={'AA'} />

      <View style={{padding: 20, paddingTop: 20}}>
        <Text style={styles.title}>{meal.title || meal.name}</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>🧂 Ingredients</Text>
          {meal.items && meal.items.length > 0 ? (
            meal.items.map((itemObj, index) => (
              <Text key={index} style={styles.text}>
                • {itemObj.item}{' '}
                {itemObj.calories ? `(~${itemObj.calories} cal)` : ''}
              </Text>
            ))
          ) : (
            <Text style={styles.text}>No ingredients listed.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>👩‍🍳 Instructions</Text>
          {instructionSteps.length > 0 ? (
            instructionSteps.map((step, index) => (
              <Text key={index} style={styles.text}>
                {index + 1}. {step}.
              </Text>
            ))
          ) : (
            <Text style={styles.text}>No instructions available.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>🥤 Beverages</Text>
          {meal.beverages && meal.beverages.length > 0 ? (
            meal.beverages.map((bev, index) => (
              <Text key={index} style={styles.text}>
                • {bev}
              </Text>
            ))
          ) : (
            <Text style={styles.text}>None</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>
            ⏱️ Cooking Time: {meal.cookTime || 'N/A'}
          </Text>
          <Text style={styles.text}>🔥 Calories: {meal.calories || 0}</Text>
        </View>

        <View style={localStyles.bottomSection}>
          <Text style={[styles.heading, {textAlign: 'center'}]}>
            Do you like this meal?
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, liked === true && styles.liked]}
              onPress={handleLike}>
              <Text style={styles.emoji}>👍</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, liked === false && styles.disliked]}
              onPress={handleDislike}>
              <Text style={styles.emoji}>👎</Text>
            </TouchableOpacity>
          </View>
          {liked !== null && (
            <Text style={styles.feedback}>
              You {liked ? 'like' : 'dislike'} this meal.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  bottomSection: {
    padding: 16,
    marginBottom: 15,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});

export default MealDetailsScreen;
