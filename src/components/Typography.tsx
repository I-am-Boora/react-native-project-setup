import React, { ReactNode } from "react";
import { Text, StyleSheet, TextStyle, TextProps } from "react-native";
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from "../theme/constant";

// Define a common interface for the component props
interface CustomTextProps extends TextProps {
  children: ReactNode;
  style?: TextStyle | TextStyle[]; // Allow for single style object or an array
}

export const Heading = ({ children, style, ...props }: CustomTextProps) => (
  <Text style={[styles.heading, style]} {...props}>
    {children}
  </Text>
);

export const Subheading = ({ children, style, ...props }: CustomTextProps) => (
  <Text style={[styles.subheading, style]} {...props}>
    {children}
  </Text>
);

export const BodyText = ({ children, style, ...props }: CustomTextProps) => (
  <Text style={[styles.body, style]} {...props}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  heading: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subheading: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  body: {
    fontSize: FONT_SIZES.md,
    color: COLORS.muted,
  },
});
