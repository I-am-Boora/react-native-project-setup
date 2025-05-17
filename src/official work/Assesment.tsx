import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from "react-native";
import React, { useEffect, useState } from "react";
import { WindowWidth } from "../theme/constant";
import CustomButton from "../components/CustomButton";
import AnimatedProgressBar from "./AnimatedProgressBar";
import { questionsData } from "./QuestionData";

const lineWidth = WindowWidth / 6;
const questions = [1, 2, 3, 4, 5];

const Assesment = () => {
  const [progressIndex, setProgressIndex] = useState<number[]>([1]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const currentQuestion = questionsData[currentIndex];
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const handleNext = () => {
    let nextIndex = currentIndex + 1;
    addProgress(progressIndex.length + 1);
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      addProgress(nextIndex);
    } else {
      // End of questions
      console.log("Quiz finished");
    }
  };

  const handleSubmit = () => {
    console.log("question finished");
  };

  const addProgress = (step: number) => {
    if (!progressIndex.includes(step)) {
      setProgressIndex((prev) => [...prev, step]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>assessment</Text>
        <View style={styles.progressContainer}>
          {questions.map((item, index) => (
            <AnimatedProgressBar
              key={item}
              active={progressIndex.includes(item)}
              width={lineWidth}
            />
          ))}
        </View>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.option}
              onPress={() => setSelectedOption(option.id)}
            >
              <View style={styles.innerView}>
                <Text style={styles.optionText}>{option.text}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
        {/* <CustomButton
          title="Next"
          style={{
            marginTop: 20,
            backgroundColor: "#0a3d62",
            alignSelf: "flex-end",
          }}
          onPress={() => {
            handleNext();
          }}
          disabled={!selectedOption}
        /> */}
        {currentIndex < questions.length - 1 ? (
          <CustomButton
            title="Next"
            style={{
              marginTop: 20,
              backgroundColor: "#0a3d62",
              alignSelf: "flex-end",
            }}
            onPress={() => {
              handleNext();
            }}
            disabled={!selectedOption}
          />
        ) : (
          <CustomButton
            title="Submit"
            style={{
              marginTop: 20,
              backgroundColor: "#0a3d62",
              alignSelf: "flex-end",
            }}
            onPress={() => {
              handleSubmit();
            }}
            disabled={!selectedOption}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Assesment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0a3d62",
    paddingBottom: 20,
  },
  mainContainer: {
    padding: 20,
  },
  progressContainer: {
    flexDirection: "row",
    columnGap: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingVertical: 20,
  },
  option: {
    backgroundColor: "#0a3d62",
    justifyContent: "center",
    rowGap: 10,
    marginVertical: 10,
    // paddingVertical: 20,
    height: 65,
    paddingHorizontal: 5,
    borderRadius: 20,
  },
  optionText: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
  innerView: {
    height: 55,
    borderRadius: 14,
    justifyContent: "center",
    paddingHorizontal: 5,

    backgroundColor: "#0261a2",
  },
});
