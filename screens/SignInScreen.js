import { useState, useContext } from 'react';
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from '../ContextObjs';


export default function SignInScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn } = useContext(AuthContext)

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, {marginBottom: 12}]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={() => signIn({email, password})}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Text>Dont's have an account yet?</Text>
      <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
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