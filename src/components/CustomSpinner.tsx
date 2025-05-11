import React, {useRef, useEffect} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {Colors} from '../theme/constant';

interface CustomSpinnerProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

const CustomSpinner: React.FC<CustomSpinnerProps> = ({
  size = 24,
  color = Colors.primary,
  style,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    spin.start();
    return () => spin.stop();
  }, [rotateAnim]);

  const spinStyle = {
    transform: [
      {
        rotate: rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[
        styles.spinner,
        {width: size, height: size, borderColor: color},
        spinStyle,
        style,
      ]}
    />
  );
};

export default CustomSpinner;

const styles = StyleSheet.create({
  spinner: {
    borderWidth: 4,
    borderRadius: 50,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: Colors.primary,
  },
});
