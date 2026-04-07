import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';

export default function AnimatedSplash() {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const rise = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, rise, scale]);

  return (
    <View style={styles.container}>
      <View style={styles.glow} />
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fade,
            transform: [{ scale }, { translateY: rise }],
          },
        ]}
      >
        <Image source={require('../../../assets/logo-mental.com.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.eyebrow}>MENTAL.COM</Text>
        <Text style={styles.title}>A calmer way to book mental health care.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#002324',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(235,250,207,0.15)',
  },
  card: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  eyebrow: {
    color: '#A1AD95',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 10,
  },
  title: {
    color: '#EBFACF',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 32,
  },
});
