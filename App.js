import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import * as SecureStore from 'expo-secure-store';

const Stack = createNativeStackNavigator();

export default function App({navigation}) {

  const [ signedIn, setSignedIn ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(true)

  // if (isLoading) {
  //   // We haven't finished checking for the token yet
  //   return <SplashScreen />;
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
      {signedIn ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
