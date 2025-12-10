import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import Icon from "react-native-vector-icons/Ionicons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeInDown,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

// Create an Animated View for the heart
const AnimatedIconView = Animated.createAnimatedComponent(View);

const HealthCard = () => {
  // 1. Dynamic State for Data
  const [spo2, setSpo2] = useState(98);
  const [bpm, setBpm] = useState(75);
  const [status, setStatus] = useState("Normal");
  const [themeColor, setThemeColor] = useState("#22c55e"); // Default Green

  // Shared values for animation
  const heartScale = useSharedValue(1);
  const graphTranslateX = useSharedValue(0);

  // 2. Data Simulation Logic (Auto-update readings)
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       // Randomize values to demonstrate dynamic changes
  //       // SpO2 between 92 and 100
  //       const newSpo2 = Math.floor(Math.random() * (100 - 92 + 1) + 92);
  //       // BPM between 60 and 110
  //       const newBpm = Math.floor(Math.random() * (110 - 60 + 1) + 60);

  //       setSpo2(newSpo2);
  //       setBpm(newBpm);

  //       // Determine Status & Color based on logic
  //       if (newSpo2 < 95 || newBpm > 100 || newBpm < 60) {
  //         setStatus("Warning");
  //         setThemeColor("#ff5252"); // Red for danger
  //       } else {
  //         setStatus("Normal");
  //         setThemeColor("#22c55e"); // Green for good
  //       }
  //     }, 3000); // Change every 3 seconds

  //     return () => clearInterval(interval);
  //   }, []);

  // 3. Animation Logic
  useEffect(() => {
    // Pulse Animation
    heartScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 100, easing: Easing.ease }),
        withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: (60 / bpm) * 500 }) // Dynamic beat speed based on BPM
      ),
      -1,
      false
    );

    // Graph Scroll Animation
    graphTranslateX.value = withRepeat(
      withTiming(-CARD_WIDTH, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, [bpm]); // Re-run animation calculation if BPM changes

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const graphAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: graphTranslateX.value }],
  }));

  // Helper to get status bar colors
  const getStatusBarColors = () => {
    return status === "Normal"
      ? ["#4ade80", "#22c55e"] // Green Gradient
      : ["#ff7e5f", "#ff5252"]; // Red/Orange Gradient
  };

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInDown.delay(200).duration(1000).springify()}
      >
        <LinearGradient
          colors={["#6DD5FA", "#8e9eab", "#4c669f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconContainer}>
                <Icon name="pulse" size={20} color="#fff" />
              </View>
              <Text style={styles.headerTitle}>Oxymeter</Text>
            </View>
          </View>
          {/* Heart Section */}
          <AnimatedIconView style={[styles.heartWrapper, heartAnimatedStyle]}>
            {/* Glow color changes dynamically with themeColor */}
            <View
              style={[
                styles.heartGlowLarge,
                { backgroundColor: themeColor, opacity: 0.2 },
              ]}
            />
            <View
              style={[
                styles.heartGlowSmall,
                { backgroundColor: themeColor, opacity: 0.4 },
              ]}
            />
            <Icon
              name="heart"
              size={50}
              color={themeColor === "#22c55e" ? "#fff" : "#ffcccc"}
              style={styles.heartIcon}
            />
          </AnimatedIconView>

          {/* Metrics Section */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>
                {spo2}
                <Text style={styles.percent}>%</Text>
              </Text>
              <Text style={styles.metricLabel}>SpO2</Text>
            </View>

            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{bpm}</Text>
              <Text style={styles.metricLabel}>PR BPM</Text>
            </View>
          </View>

          {/* Graph Section with Dynamic Gradient Stroke */}
          <View style={styles.graphContainer}>
            {/* Define the gradient only once */}
            <Svg height="0" width="0">
              <Defs>
                <SvgLinearGradient
                  id="dynamicWaveGrad"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <Stop offset="0" stopColor={themeColor} stopOpacity="0" />
                  <Stop offset="0.5" stopColor={themeColor} stopOpacity="1" />
                  <Stop offset="1" stopColor={themeColor} stopOpacity="0" />
                </SvgLinearGradient>
              </Defs>
            </Svg>

            <Animated.View style={[styles.scrollingGraph, graphAnimatedStyle]}>
              <GraphSegment width={CARD_WIDTH} />
              <GraphSegment width={CARD_WIDTH} />
            </Animated.View>
          </View>

          {/* Dynamic Status Bar */}
          <View style={styles.statusContainer}>
            <LinearGradient
              colors={getStatusBarColors()}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.statusBar}
            >
              <Text style={styles.statusText}>{status}</Text>
              <View style={styles.checkIconWrapper}>
                <Icon
                  name={status === "Normal" ? "checkmark" : "alert"}
                  size={16}
                  color={themeColor}
                />
              </View>
            </LinearGradient>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

// Reusable Graph Segment Component
const GraphSegment = ({ width }) => (
  <Svg height="60" width={width} viewBox={`0 0 ${width} 60`}>
    <Path
      d={`M0,30 L40,30 L50,10 L60,50 L70,20 L80,40 L90,30 L130,30 L140,5 L150,55 L160,30 L${width},30`}
      stroke="url(#dynamicWaveGrad)" // This references the gradient in Defs above
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  card: {
    width: CARD_WIDTH,
    height: 480,
    borderRadius: 30,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    overflow: "hidden",
  },
  // Heart
  heartWrapper: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
  },
  heartIcon: {
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  heartGlowSmall: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  heartGlowLarge: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  // Metrics
  metricsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginTop: 20,
  },
  metricItem: {
    alignItems: "center",
  },
  metricValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    includeFontPadding: false,
  },
  percent: {
    fontSize: 24,
    fontWeight: "600",
  },
  metricLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    fontWeight: "500",
    marginTop: -5,
  },
  // Graph
  graphContainer: {
    width: CARD_WIDTH,
    height: 60,
    justifyContent: "center",
    alignItems: "flex-start",
    overflow: "hidden",
  },
  scrollingGraph: {
    flexDirection: "row",
    width: CARD_WIDTH * 2,
  },
  // Status Bar
  statusContainer: {
    width: "100%",
    marginBottom: 10,
  },
  statusBar: {
    width: "100%",
    height: 55,
    borderRadius: 27.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  statusText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  checkIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  // ---------------------
  heartWrapper: {
    marginTop: 10, // Reduced margin since we added a header
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
  },
});

export default HealthCard;
