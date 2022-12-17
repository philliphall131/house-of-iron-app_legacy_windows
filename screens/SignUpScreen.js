import { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight } from "react-native";
import { AuthContext, StateContext } from '../ContextObjs';
import ironAPI from '../utils/ironAPI';

export default function SignUpScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const { signIn } = useContext(AuthContext)
  const { dispatch } = useContext(StateContext)

  const submitSignUp = async () => {
    if (password !== password2){
      alert('Passwords do not match')
      return
    } else {
      let data = {
        'email': email,
        'password': password,
        'first_name': firstName,
        'last_name': lastName
      }
      let response = await ironAPI.signup(data)
      if (response){
        if (response.error) {
          alert(`Invalid login credentials`)
          return
        } else {
          dispatch({ type: 'SIGN_IN', data: response.data });
          return
        }
      } 
      alert('Signup failed, try again or contact site admin')
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, {marginBottom: 12}]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, {marginBottom: 12}]}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={[styles.input, {marginBottom: 12}]}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={[styles.input, {marginBottom: 12}]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Re-enter Password"
        value={password2}
        onChangeText={setPassword2}
        secureTextEntry
      />
      <TouchableHighlight style={styles.button} onPress={submitSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 600,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    textAlign: 'center',
    height: 50,
    width: 230,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: '#12130F'
  },
  button: {
    height: 50,
    width: 230,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: "#8a9a3c",
    padding: 10,
    margin: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#12130F',
  },
  buttonText: {
    fontSize: 20,
    color: '#ffffff',
  },
});