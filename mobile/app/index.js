import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Animated 
} from "react-native";

import { useRouter } from "expo-router";
import { useState, useRef } from "react";

export default function Login() {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.container}>

      <View style={styles.card}>

        {/* Logo */}
        <Image
          source={require("../assets/images/splash.png")}
          style={styles.logo}
        />

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        {/* Email */}
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor="#777"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="********"
            placeholderTextColor="#777"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Login Button */}
        <Animated.View style={styles.animatedButton(scaleValue)}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/user/dashboard")}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Signup Redirect */}
        <Text style={styles.signupText}>
          Do not have an account?
          <Text style={styles.signupLink} onPress={() => router.push("/register")}>
            {" "}Sign Up
          </Text>
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  card: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#E5DDDE",
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 5,
    alignItems: "flex-start",
  },

  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#002324",
    textAlign: "center",
    alignSelf: "stretch",
  },

  subtitle: {
    fontSize: 14,
    color: "#A1AD95",
    textAlign: "center",
    marginBottom: 15,
    alignSelf: "stretch",
  },

  field: {
    width: "100%",
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#002324",
    marginBottom: 4,
    marginLeft: 2,
  },

  input: {
    width: "100%",
    height: 42,
    borderWidth: 1,
    borderColor: "#A1AD95",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
  },

  animatedButton: (scaleValue) => ({
    transform: [{ scale: scaleValue }],
    width: "100%",
  }),

  button: {
    backgroundColor: "#002324",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },

  buttonText: {
    color: "#EBFACF",
    fontWeight: "bold",
    fontSize: 16,
  },

  signupText: {
    textAlign: "center",
    width: "100%",
    marginTop: 15,
  },

  signupLink: {
    color: "#002324",
    fontWeight: "bold",
  },

});