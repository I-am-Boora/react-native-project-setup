// constants.ts

import { Dimensions } from "react-native";

export const Colors = {
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

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  title: 32,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  round: 9999,
};

export const Padding = Spacing;
export const Margin = Spacing;
export const WindowWidth = Dimensions.get('window').width
export const WindowHeight = Dimensions.get('window').height