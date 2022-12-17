import { useEffect, useReducer, useMemo } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import * as SecureStore from 'expo-secure-store';
import { AuthContext, StateContext } from './ContextObjs';
import ironAPI from './utils/ironAPI';

const Stack = createNativeStackNavigator();

export default function App() {

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.data.token,
            user: action.data.user,
            isLoading: false,

          };
        case 'SIGN_IN':
          // store the token
          if (Platform.OS === 'web') {
            sessionStorage.setItem("userToken", action.data.token);
            sessionStorage.setItem("userId", action.data.user.id);
          } else {
            SecureStore.setItemAsync('userToken', action.data.token);
            SecureStore.setItemAsync('userId', String(action.data.user.id));
          }
          return {
            ...prevState,
            isSignout: false,
            userToken: action.data.token,
            user: action.data.user
          };
        case 'SIGN_OUT':
          // reset token to null
          if (Platform.OS === 'web') {
            sessionStorage.setItem("userToken", null);
            sessionStorage.setItem("userId", null);
          } else {
            SecureStore.deleteItemAsync('userToken', null);
            SecureStore.deleteItemAsync('userId', null);
          }
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            user: null
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      user: null
    }
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      let userId;
      let data = { user: null, token: null };
      try {
        // Restore token
        if (Platform.OS === 'web'){
          userId = sessionStorage.getItem('userId')
          userToken = sessionStorage.getItem("userToken");
        } else {
          userId = await SecureStore.getItemAsync('userId');
          userToken = await SecureStore.getItemAsync('userToken');
        }
      } catch (e) {
        console.log('Error retrieving token')
      }
      // If a token was retrieved, validate Token, get user info
      if (userId && userToken){
        let userResponse = await ironAPI.getUser(userId, userToken)
        if (userResponse && userResponse.data){
          data = { user: userResponse.data, token: userToken }
        } else {
          console.log('Could not retrieve user with credentials stored, try logging in')
        }
      };
      dispatch({ type: 'RESTORE_TOKEN', data });
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: async (data) => {
      // get a token (and handle errors)
      let response = await ironAPI.login(data)
      if (response){
        if (response.error) {
          alert(`${response.error}: Invalid login credentials`)
          return
        } else if (response.data && response.data.token && response.data.user) {
          // add the token to state
          dispatch({ type: 'SIGN_IN', data: response.data });
          return
        } else {
          alert('Error with login response, contact site admin')
          return
        }
      }
      alert('Error with login request, contact site admin')
    },
    signOut: () => dispatch({ type: 'SIGN_OUT' }),
    signUp: async (data) => {
      // In a production app, we need to send user data to server and get a token
      // We will also need to handle errors if sign up failed
      // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
      // In the example, we'll use a dummy token

      dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
    },
  };

  const stateContext = {
    'state': state,
    'dispatch': dispatch
  }

  return (
    <AuthContext.Provider value={authContext}>
      <StateContext.Provider value={stateContext}>
        <NavigationContainer>
          <Stack.Navigator>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : state.userToken == null ? (
            <>
              <Stack.Screen 
                name="SignIn" 
                component={SignInScreen} 
                options={{
                  title: 'Sign In',
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                  headerStyle: {
                    backgroundColor: '#8a9a3c',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              />
              <Stack.Screen 
                name="SignUp" 
                component={SignUpScreen} 
                options={{
                  title: 'Sign Up',
                  headerStyle: {
                    backgroundColor: '#8a9a3c',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              />
            </>
          ) : (
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
          </Stack.Navigator>
        </NavigationContainer>
      </StateContext.Provider>
    </AuthContext.Provider>
  );
}