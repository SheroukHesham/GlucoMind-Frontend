import {IUser} from '../interfaces';
import {Text} from 'react-native-gesture-handler';
import styles from '../Styles/RegistrationStylesheet';
import {foodItems} from '../data';
import {FlatList, TouchableOpacity, View} from 'react-native';

interface IProps {
  user: IUser;
  setUser: (value: React.SetStateAction<IUser>) => void;
  forLiked: boolean;
}

interface IBubble {
  label: string;
  selected: boolean;
  onPress: () => void;
  type: 'like' | 'dislike';
}

const Bubble = ({label, selected, onPress, type}: IBubble) => {
  // Colors based on type and selection
  const backgroundColor = selected
    ? type === 'like'
      ? '#4CAF50'
      : '#E53935' // green or red
    : '#CCC';

  const textColor = selected ? '#fff' : '#333';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="my-2 py-2 px-4 rounded-full mr-3"
      style={{backgroundColor: backgroundColor, borderColor: backgroundColor}}>
      <Text style={[styles.bubbleText, {color: textColor}]}>{label}</Text>
    </TouchableOpacity>
  );
};

const MealPreferences = ({user, setUser, forLiked}: IProps) => {
  const toggleMeal = (meal: string, isLiked: boolean) => {
    setUser(prevUser => {
      const isMealDisliked = prevUser.dislikedRecipes.includes(meal);
      const isMealLiked = prevUser.likedRecipes.includes(meal);

      if (isLiked) {
        return {
          ...prevUser,
          dislikedRecipes: isMealDisliked
            ? prevUser.dislikedRecipes.filter(m => m !== meal)
            : prevUser.dislikedRecipes,
          likedRecipes: isMealLiked
            ? prevUser.likedRecipes.filter(m => m !== meal)
            : [...prevUser.likedRecipes, meal],
        };
      }

      return {
        ...prevUser,
        likedRecipes: isMealLiked
          ? prevUser.likedRecipes.filter(m => m !== meal)
          : prevUser.likedRecipes,
        dislikedRecipes: isMealDisliked
          ? prevUser.dislikedRecipes.filter(m => m !== meal)
          : [...prevUser.dislikedRecipes, meal],
      };
    });
  };

  return (
    <View className="flex items-center justify-center mb-5">
      <View className="flex flex-row w-full justify-left items-center gap-2 mb-1">
        <Text className="text-xl font-semibold">
          {forLiked ? 'Liked Meals' : 'Disliked Meals'}
        </Text>
        <Text
          className="rounded-full text-white px-2 py-1 text-center "
          style={
            forLiked
              ? {backgroundColor: '#4CAF50'}
              : {backgroundColor: '#E53935'}
          }>
          {forLiked ? user.likedRecipes.length : user.dislikedRecipes.length}
        </Text>
      </View>

      <FlatList
        data={foodItems}
        numColumns={4}
        showsVerticalScrollIndicator
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Bubble
            label={item}
            selected={
              forLiked
                ? user.likedRecipes.includes(item)
                : user.dislikedRecipes.includes(item)
            }
            onPress={() => {
              toggleMeal(item, forLiked);
            }}
            type={forLiked ? 'like' : 'dislike'}
          />
        )}
        centerContent
      />
    </View>
  );
};

export default MealPreferences;
