import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import NewHome from '../Screens/NewHome';
import RegistrationForm from '../Screens/RegistrationForm';
import MealDetailsScreen from '../Screens/MealDetailsScreen';
import MealPlanScreen from '../Screens/MealPlanScreen';
import MedicationsScreen from '../Screens/MedicationsScreen';
import LoginScreen from '../Screens/Login';
import ConfigureSensorScreen from '../Screens/SensorConfig';
import ManageAccountScreen from '../Screens/ManageAccount';
import MockScreen from '../Screens/MockScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer navigation used AFTER registration
const MainMenuNavigation = () => {
  // TODO: REMOVE INITIAL ROUTE NAME
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{header: () => null, headerShown: false}}>
      <Drawer.Screen name="Home" component={NewHome} />
      <Drawer.Screen name="Meal Plan" component={MealPlanScreen} />
      <Drawer.Screen name="Meal Details" component={MealDetailsScreen} />
      <Drawer.Screen name="Medications" component={MedicationsScreen} />
      <Drawer.Screen name="Blood Glucose History" component={NewHome} />
      <Drawer.Screen
        name="Configure Sensor"
        component={ConfigureSensorScreen}
        initialParams={{userId: 'defaultUserId'}}
      />
      <Drawer.Screen
        name="Manage Account"
        component={ManageAccountScreen}
        initialParams={{reloadKey: Date.now()}}
      />
      <Drawer.Screen name="Logout" component={LoginScreen} />
      <Drawer.Screen name="Mock" component={MockScreen} />
    </Drawer.Navigator>
  );
};

//Stack navigation that starts with RegistrationForm
// const MainNavigation = () => {
//   return (
//     <Stack.Navigator
//       screenOptions={{header: () => null, headerShown: false}}
//       initialRouteName="RegistrationForm">
//       <Stack.Screen name="RegistrationForm" component={RegistrationForm} />
//       <Stack.Screen name="Drawer" component={MainMenuNavigation} />
//       <Stack.Screen name="MealDetails" component={MealDetailsScreen} />
//     </Stack.Navigator>
//   );
// };

const MainNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{header: () => null, headerShown: false}}
      initialRouteName="Drawer">
      <Stack.Screen name="RegistrationForm" component={RegistrationForm} />
      <Stack.Screen name="Drawer" component={MainMenuNavigation} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
