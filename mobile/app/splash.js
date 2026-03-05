import { View, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Splash() {

  const router = useRouter();

  useEffect(() => {

    setTimeout(() => {
      router.replace("/");
    }, 2500);

  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/splash.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#002324",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 220,
    height: 220,
  },

});