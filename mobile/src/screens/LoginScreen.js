import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { loginUser } from "@/api/authService";

export default function LoginScreen() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const data = await loginUser({
        email,
        password
      });

      console.log("TOKEN:", data.token);

    } catch (error) {
      console.log(error);
    }

  };

  return (
    <View>

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
      />

      <Text>Password</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />

    </View>
  );
}