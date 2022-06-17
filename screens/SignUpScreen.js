import * as React from 'react';
import { Button, View, Text, TextInput } from "react-native";

export default function SignUpScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <View>
      <Text>Sign Up!</Text>
    </View>
  );
}