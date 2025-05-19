import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  Image,
} from "react-native";

import React, { useEffect, useState } from "react";
import { WindowWidth } from "../theme/constant";
import CustomButton from "../components/CustomButton";
import AnimatedProgressBar from "./AnimatedProgressBar";
import { questionsData } from "./QuestionData";
import RNAlert from "../components/RNAlert";
import RadioButton from "../components/RadioButton";
import NumberPicker from "./NumberPIcker";

export const QuestionOneUI = ({
  selectedOption,
  onPress,
}: {
  selectedOption: string | null;
  onPress: (id: string) => void;
}) => {
  return (
    <View>
      <Text style={styles.questionText}>{questionsData[0].question}</Text>
      {questionsData[0].options.map((option) => (
        <TouchableOpacity
          key={option.id}
          // style={styles.option}
          onPress={() => onPress(option.id)}
          activeOpacity={0.6}
        >
          <View style={styles.innerView}>
            <Text style={styles.optionText}>{option.text}</Text>
            <Image
              source={selectedOption == option.id ? circle_mark : circle}
              style={styles.image}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const RadioButtonCard = ({ value, selectgender, onPress, title }) => {
  return (
    <View
      style={{
        backgroundColor: "lightgrey",
        height: 200,
        width: "100%",
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          columnGap: 20,
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 30 }}>{title}</Text>
        <TouchableOpacity
          onPress={() => {
            onPress(value);
            console.log("selected value----", value);
          }}
          style={{
            borderWidth: 2,
            width: 24,
            height: 24,
            borderRadius: 12,
            justifyContent: "center",
          }}
        >
          {selectgender == value && (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                padding: 5,
                backgroundColor: "black",
                alignSelf: "center",
              }}
            ></View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const QuestionTwoUI = ({
  selectgender,
  onPress,
}: {
  onPress: (id: string) => void;
}) => {
  return (
    <View>
      <Text style={styles.questionText}>Select your gender</Text>
      {["Men", "Women"].map((gender, index) => {
        return (
          <RadioButtonCard
            key={index.toString()}
            value={gender}
            selectgender={selectgender}
            onPress={onPress}
            title={gender.toUpperCase()}
          />
        );
      })}
    </View>
  );
};
export const QuestionThreeUI = () => {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      <NumberPicker />
    </View>
  );
};
const lineWidth = WindowWidth / 6;
const questions = [1, 2, 3, 4, 5];
const circle = require("../images/circle.png");
const circle_mark = require("../images/circle-mark.png");
const Assesment = () => {
  const [progressIndex, setProgressIndex] = useState<number[]>([1]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const currentQuestion = questionsData[currentIndex];
  const [fadeAnim] = useState(new Animated.Value(0));
  const [gender, setGender] = useState<string | null>();
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
    setSelectedOption(null);
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
    setShowAlert(true);
    console.log("question finished");
  };

  const addProgress = (step: number) => {
    if (!progressIndex.includes(step)) {
      setProgressIndex((prev) => [...prev, step]);
    }
  };
  const handleOnPress = (id: any) => {
    setSelectedOption(id);
    if (id == "Men" || id == "Women") {
      setGender(id);
    }
  };

  const renderQuestionUI = () => {
    switch (currentIndex) {
      case 0:
        return (
          <QuestionOneUI
            selectedOption={selectedOption}
            onPress={(id: any) => handleOnPress(id)}
          />
        );
      case 1:
        return (
          <QuestionTwoUI
            selectgender={gender}
            onPress={(gender) => handleOnPress(gender)}
          />
        );
      case 2:
        return <QuestionThreeUI />;
      // etc.
      default:
        return <Text>Invalid Question</Text>;
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
          {/* <Text style={styles.questionText}>{currentQuestion.question}</Text>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              // style={styles.option}
              onPress={() => setSelectedOption(option.id)}
              activeOpacity={0.6}
            >
              <View style={styles.innerView}>
                <Text style={styles.optionText}>{option.text}</Text>
                <Image
                  source={selectedOption == option.id ? circle_mark : circle}
                  style={styles.image}
                />
              </View>
            </TouchableOpacity>
          ))} */}
          {renderQuestionUI()}
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

        <RNAlert
          isVisible={showAlert}
          message="Thankyou for successfully completing you assessment !!"
          onCancel={() => setShowAlert(false)}
          onConfirm={() => setShowAlert(false)}
        />
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
  // option: {
  //   backgroundColor: "#0a3d62",
  //   justifyContent: "center",
  //   rowGap: 10,
  //   marginVertical: 10,
  //   // paddingVertical: 20,
  //   height: 65,
  //   paddingHorizontal: 5,
  //   borderRadius: 20,
  // },
  optionText: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
  innerView: {
    flexDirection: "row",
    marginVertical: 10,
    borderWidth: 8,
    borderColor: "#0a3d62",
    height: 65,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,

    backgroundColor: "#0261a2",
  },
  image: {
    width: 24,
    height: 24,
    resizeMode: "cover",
    tintColor: "white",
  },
});
