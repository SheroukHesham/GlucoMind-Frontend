/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import styles from '../Styles/HomeMealContainerStyle';

const MealPlan = ({navigation, showButton, user}) => {
  const [meals, setMeals] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const prevFavoritesRef = useRef([]);

  useEffect(() => {
    if (!user?._id) return;

    // Fetch meals for the day
    fetch(`http://10.0.2.2:3004/recommendations/${user._id}`)
      .then(res => res.json())
      .then(data => {
        console.log(data.day_plan);
        const flatMeals = transformDayPlanToMeals(data?.day_plan);
        setMeals(flatMeals);
      })
      .catch(err => console.error('Error fetching meals:', err));

    console.log;
    // Fetch initial liked meals
    fetch(`http://10.0.2.2:3001/liked-meals/${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFavorites(data);
        } else {
          console.warn('Unexpected favorites format:', data);
          setFavorites([]);
        }
      })
      .catch(err => console.error('Error fetching favorites:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const toggleFavorite = mealName => {
    setFavorites(prev =>
      prev.includes(mealName)
        ? prev.filter(name => name !== mealName)
        : [...prev, mealName],
    );
  };

  useEffect(() => {
    if (!Array.isArray(favorites)) return;

    const prevFavorites = prevFavoritesRef.current;
    const likedMeals = favorites.filter(meal => !prevFavorites.includes(meal));
    console.log('liked meals: ', likedMeals);

    const unlikedMeals = prevFavorites.filter(
      meal => !favorites.includes(meal),
    );
    console.log('unliked meals', unlikedMeals);

    likedMeals.forEach(meal => {
      fetch(`http://10.0.2.2:3001/liked-meals/${user._id}/add`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mealName: meal}),
      }).catch(err => console.error('Error adding favorite:', err));
    });

    unlikedMeals.forEach(meal => {
      fetch(`http://10.0.2.2:3001/liked-meals/${user._id}/remove`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mealName: meal}),
      }).catch(err => console.error('Error removing favorite:', err));
    });

    prevFavoritesRef.current = favorites;
  }, [favorites, user?._id]);

  // TODO: Add dislike button and logic

  // TODO: test
  const handleGenerateNewPlan = () => {
    fetch(`http://10.0.2.2:3004/recommend/${user._id}`, {
      method: 'POST',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to generate new meal plan');
        return res.json();
      })
      .then(newData => {
        const flatMeals = transformDayPlanToMeals(newData?.day_plan);
        setMeals(flatMeals);
      })
      .catch(err => console.error('Error generating new plan:', err));
  };

  const renderMealCard = ({item}) => {
    const isFav = favorites.includes(item.name);

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Meal Details', {
            meal: item,
            user: user,
          })
        }>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.mealTitle}>{item.title}</Text>
            <TouchableOpacity onPress={() => toggleFavorite(item.name)}>
              <Text style={{fontSize: 24, color: isFav ? 'red' : '#aaa'}}>
                {isFav ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.mealName}>{item.name}</Text>
          <Text style={styles.detailText}>Cook Time: {item.cookTime}</Text>
          <Text style={styles.detailText}>Calories: {item.calories}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const transformDayPlanToMeals = dayPlan => {
    if (!dayPlan || typeof dayPlan !== 'object') return [];

    return Object.entries(dayPlan).map(([key, value]) => {
      const title = key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()); // "morning_snack" → "Morning Snack"

      return {
        id: value._id?.$oid || key,
        title,
        name: title,
        cookTime: estimateCookTimeFromInstructions(value.instructions),
        calories: value.total_calories || 0,
        instructions: value.instructions,
        items: value.items || [],
        beverages:
          Array.isArray(value.beverages) && value.beverages.length > 0
            ? value.beverages
            : ['None'],
      };
    });
  };

  // TODO: get the estimated time from day plan after fixing prompt
  const estimateCookTimeFromInstructions = (instructions = '') => {
    const timeMatch = instructions.match(/(\d+)\s*minutes?/i);
    return timeMatch ? `~${timeMatch[1]} mins` : '~10 mins';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Drawer', {
            params: {user: user},
            screen: 'Meal Plan',
          })
        }>
        <Text style={styles.title}>Today's Meal Plan</Text>
      </TouchableOpacity>
      <FlatList
        scrollEnabled={false}
        data={meals}
        keyExtractor={item => item.id}
        renderItem={renderMealCard}
        contentContainerStyle={{paddingBottom: 20}}
      />

      {showButton && (
        <TouchableOpacity
          style={localStyles.generateButton}
          onPress={handleGenerateNewPlan}>
          <Text style={localStyles.generateButtonText}>Generate New Plan</Text>
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
});

export default MealPlan;
