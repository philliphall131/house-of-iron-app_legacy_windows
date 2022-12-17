import { useContext } from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import { AuthContext, StateContext } from "../ContextObjs";

export default function HomeScreen() {
  const { signOut } = useContext(AuthContext);
  const { state } = useContext(StateContext);

    return (
      <View style={styles.container}>
        <Text>{state.user.first_name} is signed in!</Text>
        <Button title="Sign out" onPress={signOut}/>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 600,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});