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
  const {meal} = route.params;

  const [liked, setLiked] = useState(null); // null | true | false

  const handleLike = () => setLiked(true);
  const handleDislike = () => setLiked(false);

  // TODO: Toggle liked and disliked and useref to add and unadd them from back end on press
  // same as like in homepage

  return (
    <ScrollView style={{flex: 1}}>
      <Header navigation={navigation} initials={'AA'} />

      <View style={{padding: 20, paddingTop: 20}}>
        <Text style={styles.title}>{meal.name}</Text>
        <View style={styles.section}>
          <Text style={styles.heading}>🧂 Ingredients</Text>
          {meal.ingredients.map((item, index) => (
            <Text key={index} style={styles.text}>
              • {item.name}: {item.quantity}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>👩‍🍳 Instructions</Text>
          {meal.instructions.map((step, index) => (
            <Text key={index} style={styles.text}>
              {index + 1}. {step}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.text}>⏱️ Cooking Time: {meal.totalTime}</Text>
          <Text style={styles.text}>🔥 Calories: {meal.totalCalories}</Text>
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
