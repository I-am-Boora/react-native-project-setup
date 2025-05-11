import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {Colors} from '../theme/constant';

interface BouncingDotsLoaderProps {
  dotColor?: string;
  dotSize?: number;
  bounceHeight?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

const Loader: React.FC<BouncingDotsLoaderProps> = ({
  dotColor = Colors.primary,
  dotSize = 10,
  bounceHeight = 10,
  duration = 500,
  style,
}) => {
  const bounceAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const animations = bounceAnims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 100),
          Animated.timing(anim, {
            toValue: -bounceHeight,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    animations.forEach(anim => anim.start());
    return () => animations.forEach(anim => anim.stop());
  }, [bounceAnims, bounceHeight, duration]);

  return (
    <View style={[styles.container, style]}>
      {bounceAnims.map((anim, idx) => (
        <Animated.View
          key={idx}
          style={[
            styles.dot,
            {
              backgroundColor: dotColor,
              width: dotSize,
              height: dotSize,
              transform: [{translateY: anim}],
            },
          ]}
        />
      ))}
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    borderRadius: 999,
  },
});
