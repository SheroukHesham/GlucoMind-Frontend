import React, {createContext, useContext, useState, useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [fcmToken, setFcmToken] = useState('');

  // Get FCM token on mount
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await messaging().getToken();
        setFcmToken(token);
      } catch (e) {
        console.warn('Failed to get FCM token:', e);
      }
    };
    getToken();
  }, []);

  // Listen for FCM token refresh
  useEffect(() => {
    const unsubscribe = messaging().onTokenRefresh(async newToken => {
      setFcmToken(newToken);
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

  return (
    <UserContext.Provider value={{user, setUser, fcmToken, setFcmToken}}>
      {children}
    </UserContext.Provider>
  );
};
