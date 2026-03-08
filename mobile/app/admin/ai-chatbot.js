import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

export default function AIChatbot(){
  return (
    <ImageBackground
      source={require("../../assets/images/splash.png")}
      style={{flex:1}}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>AI Chatbot</Text>
        <Text style={styles.info}>Admin can chat with AI assistant here.</Text>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container:{ padding:20 },
  title:{ fontSize:26, fontWeight:'700', color:'#002324', marginBottom:20 },
  info:{ fontSize:16, color:'#4E5E5B' }
});