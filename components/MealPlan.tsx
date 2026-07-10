import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import styles from '../Styles/HomeMealContainerStyle';
import {useUser} from '../contexts/userContext';
import {IMeal, INavigation} from '../interfaces';
import {transformDayPlanToMeals} from '../functions';

interface IProps extends INavigation {
  showButton?: boolean;
}

const POLL_INTERVAL = 4000; // 4 seconds

const MealPlan = ({navigation, showButton}: IProps) => {
  const context = useUser();
  const {mealPlan, setMealPlan, user} = context;
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef<number | null>(null);
  const prevFavoritesRef = useRef<string[]>([]);

  const fetchMealPlan = async () => {
    if (!user?._id) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `http://10.0.2.2:3004/recommendations/${user._id}`,
      );
      const data = await res.json();
      const flatMeals: IMeal[] = transformDayPlanToMeals(data?.day_plan);
      setMealPlan(flatMeals);
      if (flatMeals.length > 0) {
        setLoading(false);
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } else {
        setLoading(true);
        // Start polling if not already started
        if (!pollingRef.current) {
          pollingRef.current = setInterval(() => {
            fetchMealPlan();
          }, POLL_INTERVAL);
        }
      }
    } catch (err) {
      setLoading(true);
      console.error('Error fetching meals:', err);
      // Start polling if not already started (handle first fetch error)
      if (!pollingRef.current) {
        pollingRef.current = setInterval(() => {
          fetchMealPlan();
        }, POLL_INTERVAL);
      }
    }
  };

  // Initial fetch and polling if no meals
  useEffect(() => {
    if (!user?._id) {
      return;
    }
    setMealPlan([]); // Reset meals on user change
    setLoading(true);
    fetchMealPlan();
    // Start polling if no meals
    pollingRef.current = setInterval(() => {
      fetchMealPlan();
    }, POLL_INTERVAL);
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // Stop polling if meals are loaded
  useEffect(() => {
    if (mealPlan && mealPlan.length > 0 && pollingRef.current) {
      setLoading(false);
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, [mealPlan]);

  // Fetch initial liked meals
  useEffect(() => {
    if (!user?._id) {
      return;
    }
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

  const toggleFavorite = (mealName: string) => {
    setFavorites(prev =>
      prev.includes(mealName)
        ? prev.filter(name => name !== mealName)
        : [...prev, mealName],
    );
  };

  useEffect(() => {
    if (!Array.isArray(favorites)) {
      return;
    }
    const prevFavorites = prevFavoritesRef.current;
    const likedMeals = favorites.filter(meal => !prevFavorites.includes(meal));
    const unlikedMeals = prevFavorites.filter(
      meal => !favorites.includes(meal),
    );
    likedMeals.forEach(meal => {
      fetch(`http://10.0.2.2:3001/liked-meals/${user?._id}/add`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mealName: meal}),
      }).catch(err => console.error('Error adding favorite:', err));
    });
    unlikedMeals.forEach(meal => {
      fetch(`http://10.0.2.2:3001/liked-meals/${user?._id}/remove`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({mealName: meal}),
      }).catch(err => console.error('Error removing favorite:', err));
    });
    prevFavoritesRef.current = favorites;
  }, [favorites, user?._id]);

  // Generate new plan and start polling
  const handleGenerateNewPlan = async () => {
    setLoading(true);
    setMealPlan([]); // Clear meals to show loading
    await fetch(`http://10.0.2.2:3004/recommend/${user?._id}`, {
      method: 'POST',
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to generate new meal plan');
        }
        return res.json();
      })
      .catch(err => {
        setLoading(false);
        console.error('Error generating new plan:', err);
      });
    // Start polling for new plan
    if (!pollingRef.current) {
      pollingRef.current = setInterval(() => {
        fetchMealPlan();
      }, POLL_INTERVAL);
    }
  };

  const renderMealCard: ListRenderItem<IMeal> = ({item}) => {
    const isFav = favorites.includes(item.title);
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
            <TouchableOpacity onPress={() => toggleFavorite(item.title)}>
              <Text
                className={`text-2xl ${isFav ? 'color-red-700' : 'color-gray-300'}`}>
                {isFav ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.mealName}>{item.title}</Text>
          <Text style={styles.detailText}>Cook Time: {item.cookTime}</Text>
          <Text style={styles.detailText}>Calories: {item.calories}</Text>
        </View>
      </TouchableOpacity>
    );
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
      {loading && (
        <View className="flex items-center my-5">
          <ActivityIndicator size="large" color="#0f9013" />
          <Text className="mt-[10] color-[#0f9013] text-lg">
            Generating your meal plan, please wait...
          </Text>
        </View>
      )}
      <FlatList
        scrollEnabled={false}
        data={mealPlan}
        keyExtractor={item => item.id}
        renderItem={renderMealCard}
        contentContainerStyle={localStyles.contentContainerStyle}
      />
      {showButton && (
        <TouchableOpacity
          style={localStyles.generateButton}
          onPress={async () => await handleGenerateNewPlan()}>
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
  contentContainerStyle: {
    paddingBottom: 20,
  },
});

export default MealPlan;
