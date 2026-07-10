import {IUser} from '../interfaces';

export const foodItems = [
  'Salad',
  'Fish',
  'Pasta',
  'Chicken',
  'Beef',
  'Eggs',
  'Rice',
  'Potatoes',
  'Beans',
  'Broccoli',
  'Spinach',
  'Carrots',
  'Peas',
  'Apple',
  'Banana',
  'Orange',
  'Grapes',
  'Yogurt',
  'Cheese',
  'Milk',
  'Shrimp',
  'Salmon',
  'Oats',
  'Soup',
  'Falafel',
  'Nuts',
];

export const defaultUser: IUser = {
  email: '',
  password: '', // Store hashed password
  name: '',
  fcmTokens: [],
  age: '',
  gender: 'Male',
  emergencyContacts: [
    {
      name: '',
      phone: '',
      email: '',
      fcmTokens: [], // optional, if contact has app and FCM tokens
    },
  ],
  dietaryRestrictions: [],
  dailyCalories: 0,
  medications: [{name: '', time: ''}],
  likedRecipes: [],
  dislikedRecipes: [],
  medicalConditions: [],
};

interface IInputField {
  name: 'name' | 'email' | 'password' | 'age' | 'dailyCalories';
  label: string;
  type: 'default' | 'email-address' | 'numeric';
}

export const inputFields: IInputField[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'default',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email-address',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'default',
  },
  {
    name: 'age',
    label: 'Age',
    type: 'numeric',
  },
  {
    name: 'dailyCalories',
    label: 'Daily Calories',
    type: 'numeric',
  },
];
