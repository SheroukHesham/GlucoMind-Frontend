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
import {useUser} from '../contexts/userContext';
import React from 'react';
import Register from '../Screens/Register';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// LogoutScreen component to handle logout logic
const LogoutScreen = ({navigation}) => {
  const {logout} = useUser();
  React.useEffect(() => {
    logout();
    navigation.replace('Login');
  }, [logout, navigation]);
  return null;
};

// Drawer navigation used AFTER registration
const MainMenuNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{header: () => null, headerShown: false}}>
      <Drawer.Screen name="Home" component={NewHome} />
      <Drawer.Screen name="Meal Plan" component={MealPlanScreen} />
      <Drawer.Screen name="Medications" component={MedicationsScreen} />
      <Drawer.Screen
        name="Meal Details"
        component={MealDetailsScreen}
        options={{
          drawerLabelStyle: {color: '#fff'}, // assuming white background, adjust as needed
          drawerItemStyle: {position: 'absolute', bottom: 0, width: '100%'},
        }}
      />
      {/* <Drawer.Screen name="Blood Glucose History" component={NewHome} /> */}
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
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  );
};

const MainNavigation = () => {
  const {user} = useUser();
  return (
    <Stack.Navigator
      screenOptions={{header: () => null, headerShown: false}}
      initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="RegistrationForm" component={RegistrationForm} /> */}
      <Stack.Screen name="RegistrationForm" component={Register} />
      {user && <Stack.Screen name="Drawer" component={MainMenuNavigation} />}
    </Stack.Navigator>
  );
};

export default MainNavigation;
