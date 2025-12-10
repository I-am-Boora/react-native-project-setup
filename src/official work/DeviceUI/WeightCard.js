import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated, // 1. Import Animated
  Easing, // 2. Import Easing for smoother curves
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const WeightCard = () => {
  const [unit, setUnit] = useState("LBS");
  const [weight, setWeight] = useState(174.5);

  // --- Animation Values ---
  // 0 = LBS, 1 = KG. We animate this value to slide the white pill.
  const toggleAnim = useRef(new Animated.Value(0)).current;
  // Value 1 = Visible, 0 = Hidden. For the number fade effect.
  const textOpacity = useRef(new Animated.Value(1)).current;
  const textScale = useRef(new Animated.Value(1)).current;

  // Converter
  const displayWeight =
    unit === "LBS" ? weight : (weight * 0.453592).toFixed(1);

  // --- Interaction Logic ---
  const handleToggle = (selectedUnit) => {
    if (unit === selectedUnit) return; // Do nothing if clicking same unit

    // 1. Animate the Number (Fade Out & Shrink)
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(textScale, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Change the State (actual value update)
      setUnit(selectedUnit);

      // 3. Animate the Number Back In (Fade In & Grow)
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(textScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // 4. Animate the Slider (The white pill)
    Animated.timing(toggleAnim, {
      toValue: selectedUnit === "KG" ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true, // Smoother performance
    }).start();
  };

  // Interpolate the toggle value (0-1) to X position (pixels)
  // Assuming the container has padding of 4, and buttons are approx 60px wide
  const translateX = toggleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 70], // Slide 70px to the right
  });

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 40 }}>
      <LinearGradient
        colors={["#2DD4BF", "#3B82F6", "#A855F7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.5, 1]}
        style={styles.card}
      >
        <View style={styles.watermarkCircle} />

        <Text style={styles.title}>Your Current Weight</Text>

        {/* Animated Weight Text */}
        <Animated.Text
          style={[
            styles.weightValue,
            {
              opacity: textOpacity,
              transform: [{ scale: textScale }],
            },
          ]}
        >
          {displayWeight}
        </Animated.Text>

        {/* Toggle Container */}
        <View style={styles.toggleContainer}>
          {/* The Sliding White Pill (Absolute positioned behind buttons) */}
          <Animated.View
            style={[styles.slidingPill, { transform: [{ translateX }] }]}
          />

          {/* Buttons (Transparent backgrounds, sitting on top) */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handleToggle("LBS")}
            style={styles.toggleBtn}
          >
            <Text
              style={[
                styles.toggleText,
                unit === "LBS" ? styles.activeText : styles.inactiveText,
              ]}
            >
              LBS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handleToggle("KG")}
            style={styles.toggleBtn}
          >
            <Text
              style={[
                styles.toggleText,
                unit === "KG" ? styles.activeText : styles.inactiveText,
              ]}
            >
              KG
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 220,
    borderRadius: 30,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A855F7",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden",
  },
  watermarkCircle: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  title: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  weightValue: {
    color: "#fff",
    fontSize: 64,
    fontWeight: "800",
    letterSpacing: -1,
  },

  // --- Updated Toggle Switch Styles ---
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.2)", // Darker background track
    borderRadius: 20,
    padding: 4,
    marginTop: 15,
    width: 148, // Fixed width to make sliding math easy (70px btn * 2 + 8px padding)
    height: 40,
    position: "relative", // Needed for absolute positioning context
  },
  // The animated white background
  slidingPill: {
    position: "absolute",
    top: 4,
    left: 4,
    width: 70, // Matches button width
    height: 32, // Matches container height minus padding
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  toggleBtn: {
    width: 70, // Fixed width
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    zIndex: 1, // Ensure touchable is on top of the sliding pill
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "700",
  },
  activeText: {
    color: "#333", // Dark text when on white pill
  },
  inactiveText: {
    color: "rgba(255,255,255,0.6)", // Faded text when off
  },
});

export default WeightCard;
