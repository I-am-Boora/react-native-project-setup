// constants.ts

import { Dimensions } from "react-native";

export interface Theme {
  backgroundColor: string;
}

export const lightTheme = {
backgroundColor:'#FFFFFF'
}

export const darkTheme = {
backgroundColor:'#333333'
}
export const COLORS = {
  primary: '#1E90FF',
  secondary: '#FF69B4',
  background: '#FFFFFF',
  text: '#333333',
  border: '#E5E5E5',
  muted: '#888888',
  success: '#28a745',
  warning: '#ffc107',
    danger: '#dc3545',
  error:'#dc3545',
};

export const FONT_WEIGHTS = {
  regular: 'normal',
  medium: '500',
  bold: 'bold',
};
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  title: 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  round: 9999,
};

export const PADDING = SPACING;
export const MARGIN = SPACING;
export const WindowWidth = Dimensions.get('window').width
export const WindowHeight = Dimensions.get('window').height
