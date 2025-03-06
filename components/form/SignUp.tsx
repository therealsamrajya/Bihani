import { Text, View, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import Button from "../ui/Button";
import { signUpUser } from "../../firebaseconfig"; // Import as a named export

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async () => {
    try {
      await signUpUser(email, password);
      setSuccessMessage(`Sign Up was successfull ${email}`);
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <TextInput style={styles.input} onChangeText={setEmail} value={email} />
      <Text>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
      />
      <Button
        backgroundColor="bg-primary"
        title="Sign Up"
        onPress={handleSignUp}
      />

      {successMessage ? (
        <Text className="text-secondary mt-3">{successMessage}</Text>
      ) : null}
      {errorMessage ? (
        <Text className="text-tertiary mt-3">{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default SignUp;
