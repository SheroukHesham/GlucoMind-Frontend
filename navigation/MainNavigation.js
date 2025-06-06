import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import NewHome from '../Pages/NewHome';
import RegistrationForm from '../Pages/RegistrationForm';
import Header from '../Components/Header';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer navigation used AFTER registration
const MainMenuNavigation = () => {
  return (
    <Drawer.Navigator screenOptions={{header: () => null, headerShown: false}}>
      <Drawer.Screen name="Home" component={NewHome} />
      <Drawer.Screen name="Meals" component={NewHome} />
      <Drawer.Screen name="Medications" component={NewHome} />
      <Drawer.Screen name="Blood Glucose History" component={NewHome} />
      <Drawer.Screen name="Logout" component={RegistrationForm} />
    </Drawer.Navigator>
  );
};

// Stack navigation that starts with RegistrationForm
const MainNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{header: () => null, headerShown: false}}
      initialRouteName="RegistrationForm">
      <Stack.Screen name="RegistrationForm" component={RegistrationForm} />
      <Stack.Screen name="Drawer" component={MainMenuNavigation} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
