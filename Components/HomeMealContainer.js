/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import styles from '../Styles/HomeMealContainerStyle';
// import {AntDesign} from 'react-native-vector-icons'; // Make sure you have expo/vector-icons or react-native-vector-icons installed

// TODO: Get from backend
const MEALS = [
  {
    id: '1',
    title: 'Breakfast',
    name: 'Oatmeal with fruits',
    cookTime: '15 mins',
    calories: 350,
  },
  {
    id: '2',
    title: 'Morning Snack',
    name: 'Greek Yogurt',
    cookTime: '10 mins',
    calories: 150,
  },
  {
    id: '3',
    title: 'Lunch',
    name: 'Grilled Chicken Salad',
    cookTime: '30 mins',
    calories: 600,
  },
  {
    id: '4',
    title: 'Dinner',
    name: 'Baked Salmon with Veggies',
    cookTime: '25 mins',
    calories: 550,
  },
];

const MealPlan = () => {
  const [favorites, setFavorites] = useState([]);
  const prevFavoritesRef = useRef([]);

  const toggleFavorite = mealName => {
    setFavorites(prev =>
      prev.includes(mealName)
        ? prev.filter(name => name !== mealName)
        : [...prev, mealName],
    );
  };
  useEffect(() => {
    const prevFavorites = prevFavoritesRef.current;

    // Find newly liked meals (in favorites now, but not in prev)
    const likedMeals = favorites.filter(meal => !prevFavorites.includes(meal));

    console.log('liked meals: ', likedMeals);
    // Find unliked meals (in prev, but not in favorites now)
    const unlikedMeals = prevFavorites.filter(
      meal => !favorites.includes(meal),
    );
    console.log('unliked meals', unlikedMeals);

    // Send liked meals to backend
    // likedMeals.forEach(meal => {
    //   // TODO: Replace with backend URL
    //   fetch('https://your-backend/api/favorites/add', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({mealName: meal}),
    //   })
    //     .then(res => {
    //       if (!res.ok) throw new Error('Failed to add favorite');
    //     })
    //     .catch(err => console.error(err));
    // });

    // Send unliked meals to backend
    // unlikedMeals.forEach(meal => {
    //   // TODO: Replace with backend URL
    //   fetch('https://your-backend/api/favorites/remove', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({mealName: meal}),
    //   })
    //     .then(res => {
    //       if (!res.ok) throw new Error('Failed to remove favorite');
    //     })
    //     .catch(err => console.error(err));
    // });

    // Update ref for next comparison
    prevFavoritesRef.current = favorites;
  }, [favorites]);

  const renderMealCard = ({item}) => {
    const isFav = favorites.includes(item.name); // using name for favorites

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {/* Title like "Breakfast" */}
          <Text style={styles.mealTitle}>{item.title}</Text>

          {/* Favorite heart button */}
          <TouchableOpacity onPress={() => toggleFavorite(item.name)}>
            <Text style={{fontSize: 24, color: isFav ? 'red' : '#aaa'}}>
              {isFav ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Meal name like "Oatmeal with fruits" */}
        <Text style={styles.mealName}>{item.name}</Text>

        <Text style={styles.detailText}>Cook Time: {item.cookTime}</Text>
        <Text style={styles.detailText}>Calories: {item.calories}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Meal Plan</Text>
      <FlatList
        data={MEALS}
        keyExtractor={item => item.id}
        renderItem={renderMealCard}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </View>
  );
};

export default MealPlan;
