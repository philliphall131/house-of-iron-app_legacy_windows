import { useEffect, useReducer, useMemo } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
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
          return {
            ...prevState,
            isSignout: false,
            userToken: action.data.token,
            user: action.data.user
          };
        case 'SIGN_OUT':
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
      let data;
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
        console.log(userResponse)
        if (userResponse && userResponse.status && userResponse.status !== 200){
          data = { user: userResponse.data, token: userToken }
        } else {
          console.error('Error retrieving user, contact admin')
          data = { user: null, token: null }
        }
      } else {
        data = { user: null, token: null }
      }
      dispatch({ type: 'RESTORE_TOKEN', data });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        // get a token (and handle errors)
        let response = await ironAPI.login(data)
        if (!response){
          alert('Error with login request, contact site admin')
          return
        } else if (response && response.status && (response.status !== 202)) {
          alert('Invalid login credentials')
          return
        }
        // store the token
        if (Platform.OS === 'web'){
          sessionStorage.setItem("userToken", response.data.token);
          sessionStorage.setItem("userId", response.data.user.id);
        } else {
          await SecureStore.setItemAsync('userToken', response.data.token);
          await SecureStore.setItemAsync('userId', String(response.data.user.id));
        }
        // add the token to state
        dispatch({ type: 'SIGN_IN', data: response.data });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <StateContext.Provider value={state}>
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