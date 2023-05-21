import React, { useEffect, useState } from "react";
import { View, Animated, StyleSheet } from "react-native";

const Dot = ({ delay }) => {
  const [animation] = useState(new Animated.Value(0));

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => startAnimation());
  };

  useEffect(() => {
    startAnimation();
  }, []);

  const dotStyle = {
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.7, 1.2],
        }),
      },
    ],
  };

  return <Animated.View style={[styles.dot, dotStyle]} />;
};

const TypingIndicator = ({ show }) => {
  if (!show) return null;
  return (
    <View style={styles.container}>
      <Dot delay={0} />
      <Dot delay={200} />
      <Dot delay={400} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e6e6e6",
    borderRadius: 10,
    padding: 10,
    width: 65,
    height: 40,
  },
  dot: {
    backgroundColor: "darkgrey",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default TypingIndicator;
