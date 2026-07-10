//**TODO: change to redux */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import messaging from '@react-native-firebase/messaging';
import {IMeal, IUser} from '../interfaces';

interface IContext {
  user: IUser | undefined;
  setUser: (arg: IUser) => void;
  fcmToken: string[] | undefined;
  setFcmToken: (arg: string[]) => void;
  mealPlan: IMeal[] | undefined;
  setMealPlan: (arg: IMeal[]) => void;
  logout: () => void;
}

const UserContext = createContext<IContext | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('Must be used inside User Provider');
  }
  return context;
};

export const UserProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [fcmToken, setFcmToken] = useState<string[] | undefined>();
  const [mealPlan, setMealPlan] = useState<IMeal[]>(); // Add mealPlan state to context

  // Get FCM token on mount
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await messaging().getToken();
        setFcmToken([token]);
      } catch (e) {
        console.warn('Failed to get FCM token:', e);
      }
    };
    getToken();
  }, []);

  // Listen for FCM token refresh
  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(async newToken => {
      setFcmToken([newToken]);
      // Update backend if user is logged in
      if (user && user.email) {
        try {
          await fetch(`http://10.0.2.2:3001/user/${user._id}/fcm-token`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: user.email, fcmToken: newToken}),
          });
        } catch (e) {
          console.warn('Failed to update FCM token:', e);
        }
      }
    });
    return unsubscribe;
  }, [user]);

  // Reset mealPlan whenever user changes (login, logout, registration)
  useEffect(() => {
    setMealPlan(undefined);
  }, [user]);

  // Logout function to clear user and mealPlan
  const logout = () => {
    setUser(undefined);
    setMealPlan(undefined);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        fcmToken,
        setFcmToken,
        mealPlan,
        setMealPlan,
        logout,
      }}>
      {children}
    </UserContext.Provider>
  );
};
