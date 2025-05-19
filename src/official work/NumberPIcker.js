import React, { useRef, useState, useEffect } from "react";
import { Animated, FlatList, View, Text, StyleSheet } from "react-native";

const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 5;

const weights = Array.from({ length: 200 }, (_, i) => i + 1); // 1kg to 100kg

export default function WeightPicker() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [selectedWeight, setSelectedWeight] = useState(50);

  useEffect(() => {
    // Scroll to 50kg (index 49)
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: 100 * ITEM_HEIGHT,
        animated: false,
      });
    }, 0);
  }, []);

  const onScrollEnd = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    setSelectedWeight(weights[index]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selected Weight: {selectedWeight} kg</Text>

      <Animated.FlatList
        ref={flatListRef}
        data={weights}
        keyExtractor={(item) => item.toString()}
        bounces={false}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
        contentContainerStyle={{
          paddingVertical: (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 2) * ITEM_HEIGHT,
            (index - 1) * ITEM_HEIGHT,
            index * ITEM_HEIGHT,
            (index + 1) * ITEM_HEIGHT,
            (index + 2) * ITEM_HEIGHT,
          ];

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.7, 0.85, 1.2, 0.85, 0.7],
            extrapolate: "clamp",
          });

          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.3, 0.6, 1, 0.6, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              style={[styles.item, { opacity, transform: [{ scale }] }]}
            >
              <Animated.Text style={styles.text}>{item} kg</Animated.Text>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 20,
    marginBottom: 20,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    width: 200,
  },
  text: {
    fontSize: 50,
    fontWeight: "700",
  },
});
