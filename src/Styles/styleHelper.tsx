import { Platform, useWindowDimensions } from "react-native";

export function createShadow(
  elevation = 2,
  shadowColor = "#000",
  shadowOpacity = 0.2,
  shadowRadius = elevation * 0.5,
  shadowOffset = { height: elevation * 0.5, width: 0 }
) {
  return Platform.select({
    ios: {
      shadowColor,
      shadowOpacity,
      shadowRadius,
      shadowOffset,
    },
    android: {
      elevation,
    },
  });
}

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return {
    isPhone: width < 600,
    isTablet: width >= 600,
    isLandscape: width > height,

    // Helper sizing functions
    fontSize: (size: any) => Math.max(size, (width * size) / 400),
    spacing: (percent: any) => width * (percent / 100),
  };
}
