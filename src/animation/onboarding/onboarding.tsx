import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const start = require("../../images/start.png");
const one = require("../../images/one.png");
const two = require("../../images/two.png");
const three = require("../../images/three.png");

const pages = [
  { title: "Explore", description: "Discover amazing features", image: one },
  { title: "Create", description: "Build your workflow", image: two },
  { title: "Go!", description: "Launch your experience", image: three },
];

const Onboarding = () => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [pageIndex, setPageIndex] = React.useState(0);

  // Entrance animation shared values
  const imgOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  const imgTranslateY = useSharedValue(20);
  const titleTranslateY = useSharedValue(60);
  const subtitleTranslateY = useSharedValue(80);
  const buttonTranslateY = useSharedValue(100);

  const wrapperTranslateY = useSharedValue(0);

  const imageX = pages.map(() => useSharedValue(0));
  const titleX = pages.map(() => useSharedValue(0));
  const descX = pages.map(() => useSharedValue(0));
  const btnX = pages.map(() => useSharedValue(0));
  const buttonWidth = useSharedValue(50);
  const buttonRadius = useSharedValue(25);
  const [isLastPage, setIsLastPage] = useState(false);
  // Entrance animations on mount
  useEffect(() => {
    imgOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });
    imgTranslateY.value = withTiming(0, {
      duration: 800,
      easing: Easing.inOut(Easing.ease),
    });

    setTimeout(() => {
      titleOpacity.value = withTiming(1, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      });
      titleTranslateY.value = withTiming(0, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      });
    }, 300);

    setTimeout(() => {
      subtitleOpacity.value = withTiming(1, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      });
      subtitleTranslateY.value = withTiming(0, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      });
    }, 600);

    setTimeout(() => {
      buttonOpacity.value = withTiming(1, { duration: 800 });
      buttonTranslateY.value = withTiming(0, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      });
    }, 900);
  }, []);

  const animateOutPage = (index: number, onComplete: () => void) => {
    imageX[index].value = withTiming(-width, {
      duration: 600,
      easing: Easing.inOut(Easing.ease),
    });
    setTimeout(() => {
      titleX[index].value = withTiming(-width, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });
    }, 100);
    setTimeout(() => {
      descX[index].value = withTiming(-width, {
        duration: 400,
        easing: Easing.inOut(Easing.ease),
      });
    }, 200);
    setTimeout(() => {
      btnX[index].value = withTiming(
        -width,
        { duration: 600, easing: Easing.inOut(Easing.ease) },
        () => {
          runOnJS(onComplete)();
        }
      );
    }, 300);
  };

  const animateInPage = (index: number) => {
    imageX[index].value = width;
    titleX[index].value = width;
    descX[index].value = width;
    btnX[index].value = width;

    imageX[index].value = withTiming(0, {
      duration: 600,
      easing: Easing.inOut(Easing.ease),
    });
    setTimeout(() => {
      titleX[index].value = withTiming(0, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      });
    }, 100);
    setTimeout(() => {
      descX[index].value = withTiming(0, {
        duration: 900,
        easing: Easing.inOut(Easing.ease),
      });
    }, 200);
    setTimeout(() => {
      btnX[index].value = withTiming(0, {
        duration: 1100,
        easing: Easing.inOut(Easing.ease),
      });
    }, 300);
  };

  const handleBegin = () => {
    wrapperTranslateY.value = withTiming(-height, {
      duration: 600,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const handleNext = () => {
    if (pageIndex < pages.length - 1) {
      const current = pageIndex;
      const next = current + 1;

      animateOutPage(current, () => {
        scrollViewRef.current?.scrollTo({ x: next * width, animated: false });
        animateInPage(next);
        setPageIndex(next);

        if (next === pages.length - 1) {
          buttonWidth.value = withTiming(160, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
          });
          buttonRadius.value = withTiming(12, {
            duration: 800,
            easing: Easing.inOut(Easing.ease),
          });
          runOnJS(setIsLastPage)(true);
        }
      });
    } else {
      // Handle login press
      console.log("Login clicked");
    }
  };

  // Animated styles
  const wrapperStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: wrapperTranslateY.value }],
  }));

  const getStyle = (opacity, translateY) =>
    useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    }));

  const nextButtonStyle = useAnimatedStyle(() => ({
    width: buttonWidth.value,
    borderRadius: buttonRadius.value,
  }));

  const imageStyle = getStyle(imgOpacity, imgTranslateY);
  const titleStyle = getStyle(titleOpacity, titleTranslateY);
  const subtitleStyle = getStyle(subtitleOpacity, subtitleTranslateY);
  const buttonStyle = getStyle(buttonOpacity, buttonTranslateY);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.wrapper, wrapperStyle]}>
        {/* First screen */}
        <View style={styles.screen}>
          <Animated.Image source={start} style={[styles.image, imageStyle]} />
          <Animated.Text style={[styles.pageTitle, titleStyle]}>
            Xerox
          </Animated.Text>
          <Animated.Text
            style={[styles.pageDesc, subtitleStyle, { marginVertical: 20 }]}
          >
            This is a magical ride where you experience a new world
          </Animated.Text>
          <Animated.View style={buttonStyle}>
            <TouchableOpacity style={styles.button} onPress={handleBegin}>
              <Text style={styles.buttonText}>Let's begin</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Horizontal scrollable second screen */}
        <View style={{ height }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
          >
            {pages.map((page, index) => {
              const imgStyle = useAnimatedStyle(() => ({
                transform: [{ translateX: imageX[index].value }],
              }));

              const titleStyle = useAnimatedStyle(() => ({
                transform: [{ translateX: titleX[index].value }],
              }));

              const descStyle = useAnimatedStyle(() => ({
                transform: [{ translateX: descX[index].value }],
              }));
              return (
                <View key={index} style={styles.page}>
                  <Animated.Image
                    source={page.image}
                    style={[styles.image, imgStyle]}
                  />
                  <Animated.Text style={[styles.pageTitle, titleStyle]}>
                    {page.title}
                  </Animated.Text>
                  <Animated.Text style={[styles.pageDesc, descStyle]}>
                    {page.description}
                  </Animated.Text>

                  <View style={styles.pagination}>
                    {pages.map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.dot,
                          { opacity: i === pageIndex ? 1 : 0.3 },
                        ]}
                      />
                    ))}
                  </View>
                  <Animated.View style={[styles.fixedButton, nextButtonStyle]}>
                    <TouchableOpacity
                      style={styles.flexFull}
                      onPress={handleNext}
                    >
                      <Text style={styles.buttonText}>
                        {isLastPage ? "Login" : "▶︎"}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wrapper: {
    height: height * 2,
  },
  screen: {
    height,
    width,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    paddingVertical: 15,
  },
  button: {
    alignSelf: "center",
    height: 50,
    // marginTop: 20,
    width: 160,
    backgroundColor: "#b23ade",
    justifyContent: "center",
    paddingHorizontal: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    color: "white",
  },
  page: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  pageDesc: {
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: "#b23ade",
    // paddingHorizontal: 30,
    // paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  pagination: {
    flexDirection: "row",
    marginTop: 30,
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#b23ade",
  },
  fixedButton: {
    // position: "absolute",
    // bottom: 80,
    alignSelf: "center",
    height: 50,
    marginTop: 20,
    backgroundColor: "#b23ade",
    justifyContent: "center",
    alignItems: "center",
  },
  flexFull: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
