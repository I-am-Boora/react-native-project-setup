import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { darkTheme, lightTheme, Theme } from "../theme/constant";

// Define the shape of the context value
interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Define props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState<boolean>(
    Appearance.getColorScheme() === "dark"
  );
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
        setIsDark(colorScheme === "dark");
      }
    );

    return () => subscription.remove();
  }, []);

  const value: ThemeContextValue = {
    theme,
    isDark,
    setIsDark,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
