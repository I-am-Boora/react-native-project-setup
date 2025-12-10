import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

// 1. Define the 6 Segments Colors
const SEGMENTS = [
  { color: "#2196F3", label: "Low" }, // Segment 1
  { color: "#4CAF50", label: "Normal" }, // Segment 2
  { color: "#FFC107", label: "Elevated" }, // Segment 3
  { color: "#FF9800", label: "Stage 1" }, // Segment 4
  { color: "#F44336", label: "Stage 2" }, // Segment 5
  { color: "#B71C1C", label: "Crisis" }, // Segment 6
];

// 2. Logic: Return the CENTER % of the specific segment
// Total 100% / 6 segments = ~16.66% per segment.
const getBloodPressureStatus = (sys: number, dia: number) => {
  if (sys >= 180 || dia >= 120) {
    // Crisis -> Segment 6 (Center ~92%)
    return { ...SEGMENTS[5], icon: "alert-decagram", percent: 92 };
  } else if (sys >= 140 || dia >= 90) {
    // Stage 2 -> Segment 5 (Center ~75%)
    return { ...SEGMENTS[4], icon: "alert-octagon", percent: 75 };
  } else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
    // Stage 1 -> Segment 4 (Center ~58%)
    return { ...SEGMENTS[3], icon: "alert", percent: 58 };
  } else if (sys >= 120 && sys <= 129 && dia < 80) {
    // Elevated -> Segment 3 (Center ~42%)
    return { ...SEGMENTS[2], icon: "alert-outline", percent: 42 };
  } else if (sys < 90 || dia < 60) {
    // Low -> Segment 1 (Center ~8%)
    return { ...SEGMENTS[0], icon: "arrow-down-circle", percent: 8 };
  } else {
    // Normal -> Segment 2 (Center ~25%)
    return { ...SEGMENTS[1], icon: "check-circle", percent: 25 };
  }
};

const BloodPressure = () => {
  const [reading, setReading] = useState({ sys: 118, dia: 78, hr: 72 });

  // Start animation at Normal (25%)
  const progressAnim = useRef(new Animated.Value(25)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const status = useMemo(
    () => getBloodPressureStatus(reading.sys, reading.dia),
    [reading]
  );

  useEffect(() => {
    // Animate Dot Position
    Animated.timing(progressAnim, {
      toValue: status.percent,
      duration: 800,
      useNativeDriver: false,
      easing: Easing.out(Easing.back(1)), // Slight bounce effect
    }).start();

    // Animate Badge Pop
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [status]);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.delay(800),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const widthInterp = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const simulateReading = (type: string) => {
    switch (type) {
      case "crisis":
        setReading({ sys: 190, dia: 125, hr: 110 });
        break;
      case "stage2":
        setReading({ sys: 150, dia: 95, hr: 90 });
        break;
      case "stage1":
        setReading({ sys: 135, dia: 85, hr: 82 });
        break;
      case "elevated":
        setReading({ sys: 125, dia: 75, hr: 78 });
        break;
      case "normal":
        setReading({ sys: 115, dia: 75, hr: 70 });
        break;
      case "low":
        setReading({ sys: 85, dia: 55, hr: 60 });
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" /> */}

      <View style={styles.header}>
        <Text style={styles.headerDate}>Today, 8:30 AM</Text>
        <Icon name="bell-outline" size={24} color="#333" />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={["#7AB2E8", "#86E3CE"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainCard}
        >
          <View style={styles.cardTopRow}>
            <View>
              <Text style={styles.bpNumbers}>
                {reading.sys}
                <Text style={styles.bpSlash}> / </Text>
                {reading.dia}
              </Text>
              <Text style={styles.bpUnit}>SYS/DIA mmHg</Text>
            </View>

            <View style={styles.heartRateContainer}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Icon
                  name="heart"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 4 }}
                />
              </Animated.View>
              <View>
                <Text style={styles.hrValue}>{reading.hr}</Text>
                <Text style={styles.hrUnit}>BPM</Text>
              </View>
            </View>
          </View>

          {/* --- NEW GAUGE BAR --- */}
          <View style={styles.gaugeContainer}>
            {/* The Background Track with 6 Segments */}
            <View style={styles.trackBackground}>
              {SEGMENTS.map((seg, index) => (
                <View
                  key={index}
                  style={[
                    styles.trackSegment,
                    { backgroundColor: seg.color },
                    // Rounded corners for first and last
                    index === 0 && styles.firstSegment,
                    index === SEGMENTS.length - 1 && styles.lastSegment,
                  ]}
                />
              ))}
            </View>

            {/* The Animated Indicator Dot */}
            <Animated.View style={[styles.dot, { left: widthInterp }]} />
          </View>

          <Animated.View
            style={[styles.statusBadge, { transform: [{ scale: scaleAnim }] }]}
          >
            <Icon name={status.icon} size={18} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </Animated.View>
        </LinearGradient>

        <View style={styles.simulationContainer}>
          <Text style={styles.simTitle}>Simulate Readings::</Text>
          <View style={styles.simRow}>
            <TouchableOpacity
              onPress={() => simulateReading("low")}
              style={[styles.simBtn, { backgroundColor: "#2196F3" }]}
            >
              <Text style={styles.simText}>Low</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => simulateReading("normal")}
              style={[styles.simBtn, { backgroundColor: "#4CAF50" }]}
            >
              <Text style={styles.simText}>Norm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => simulateReading("elevated")}
              style={[styles.simBtn, { backgroundColor: "#FFC107" }]}
            >
              <Text style={styles.simText}>Elev</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.simRow, { marginTop: 10 }]}>
            <TouchableOpacity
              onPress={() => simulateReading("stage1")}
              style={[styles.simBtn, { backgroundColor: "#FF9800" }]}
            >
              <Text style={styles.simText}>Stg 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => simulateReading("stage2")}
              style={[styles.simBtn, { backgroundColor: "#F44336" }]}
            >
              <Text style={styles.simText}>Stg 2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => simulateReading("crisis")}
              style={[styles.simBtn, { backgroundColor: "#B71C1C" }]}
            >
              <Text style={styles.simText}>Crisis</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  content: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerDate: { fontSize: 16, color: "#666", fontWeight: "600" },

  mainCard: {
    width: "100%",
    height: 260, // Increased height slightly for the gauge
    borderRadius: 30,
    padding: 25,
    justifyContent: "space-between",
    shadowColor: "#7AB2E8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  bpNumbers: { fontSize: 48, fontWeight: "700", color: "#fff", lineHeight: 55 },
  bpSlash: { fontSize: 28, color: "rgba(255,255,255,0.7)" },
  bpUnit: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
    fontWeight: "500",
  },
  heartRateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  hrValue: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  hrUnit: { color: "#fff", fontSize: 10 },

  // --- NEW GAUGE STYLES ---
  gaugeContainer: {
    height: 30,
    justifyContent: "center",
    position: "relative",
  },
  trackBackground: {
    height: 8,
    width: "100%",
    flexDirection: "row", // Align segments horizontally
    backgroundColor: "rgba(255,255,255,0.2)", // Fallback
    borderRadius: 4,
  },
  trackSegment: {
    flex: 1, // Equal width for all 6 segments
    height: "100%",
    marginHorizontal: 1, // Tiny gap between colors for clarity
  },
  firstSegment: { borderTopLeftRadius: 4, borderBottomLeftRadius: 4 },
  lastSegment: { borderTopRightRadius: 4, borderBottomRightRadius: 4 },

  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    position: "absolute",
    borderWidth: 3,
    borderColor: "rgba(0,0,0,0.1)", // Subtle shadow border
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginLeft: -9, // Center the dot on the exact percentage point
  },
  // ------------------------

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  statusText: { fontWeight: "bold", fontSize: 14 },

  simulationContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  simTitle: { fontWeight: "bold", marginBottom: 10, color: "#333" },
  simRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  simBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  simText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
});

export default BloodPressure;
