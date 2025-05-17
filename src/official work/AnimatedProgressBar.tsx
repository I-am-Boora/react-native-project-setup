// components/AnimatedProgressBar.tsx
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

interface Props {
  active: boolean;
  delay?: number;
  width: number;
}

const AnimatedProgressBar: React.FC<Props> = ({ active, delay = 0, width }) => {
  const animatedValue = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: active ? 1 : 0,
      duration: 400,
      delay,
      useNativeDriver: false,
    }).start();
  }, [active]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["grey", "#0a3d62"],
  });

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          backgroundColor,
          width,
        },
      ]}
    />
  );
};

export default AnimatedProgressBar;

const styles = StyleSheet.create({
  bar: {
    height: 6,
    borderRadius: 3,
  },
});
