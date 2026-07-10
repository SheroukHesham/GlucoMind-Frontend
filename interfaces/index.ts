import {DrawerNavigationProp} from '@react-navigation/drawer';
import {ParamListBase} from '@react-navigation/native';

export interface IUser {
  _id?: string;
  email: string;
  password: string; // Store hashed password
  name: string;
  fcmTokens?: string[];
  age: string;
  gender: 'Male' | 'Female';
  emergencyContacts: [
    {
      name: string;
      phone: string;
      email: string;
      fcmTokens?: string[]; // optional, if contact has app and FCM tokens
    },
  ];
  dietaryRestrictions: string[];
  dailyCalories: number;
  medications: [{name: string; time: string}];
  likedRecipes: string[];
  dislikedRecipes: string[];
  medicalConditions: string[];
}

export interface INavigation {
  navigation: DrawerNavigationProp<ParamListBase, string, undefined>;
}

export interface IMeal {
  id: string;
  title: string;
  cookTime: string;
  items: {
    item: string;
    calories: number;
  }[];
  instructions: string;
  calories: number;
  caloriePercentage: number;
  beverages: string[];
  glucoseImpact: string;
  nutritionalFacts: string;
}

export interface IMealPlan {
  userId: string;
  day_plan: IDayPlan;
  summary: {
    total_day_calories: number;
    calorie_goal: number;
  };
  createdAt: string;
}

export interface IDayPlan {
  breakfast: IMeal;
  morning_snack: IMeal;
  lunch: IMeal;
  afternoon_snack: IMeal;
  dinner: IMeal;
}
