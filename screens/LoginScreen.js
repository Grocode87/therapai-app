/** Login screen */

import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { auth } from "../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen() {
  const [value, setValue] = useState({
    email: "",
    password: "",
    error: "",
  });

  async function signIn() {
    if (value.email === "" || value.password === "") {
      setValue({
        ...value,
        error: "Email and password are mandatory.",
      });
      return;
    }

    setValue({
      ...value,
      error: "",
    });

    try {
      // get the data of neewly created user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        value.email,
        value.password
      );
    } catch (error) {
      setValue({
        ...value,
        error: error.message,
      });
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {!!value.error && (
        <View style={styles.error}>
          <Text>{value.error}</Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={value.email}
        onChangeText={(text) => setValue({ ...value, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={value.password}
        onChangeText={(text) => setValue({ ...value, password: text })}
      />
      <Button title="Login" onPress={signIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
  },
});
