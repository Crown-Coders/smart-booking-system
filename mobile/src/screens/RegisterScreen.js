import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { registerUser } from "@/api/authService";

export default function RegisterScreen() {

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idNumber, setIdNumber] = useState("");

  const handleRegister = async () => {

    try {

      const data = await registerUser({
        name,
        surname,
        email,
        password,
        idNumber
      });

      console.log(data);

    } catch (error) {
      console.log(error);
    }

  };

  return (
    <View>

      <TextInput placeholder="Name" onChangeText={setName} />

      <TextInput placeholder="Surname" onChangeText={setSurname} />

      <TextInput placeholder="Email" onChangeText={setEmail} />

      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />

      <TextInput placeholder="ID Number" onChangeText={setIdNumber} />

      <Button title="Register" onPress={handleRegister} />

    </View>
  );
}