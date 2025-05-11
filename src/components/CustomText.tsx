import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  I18nManager,
  TextStyle,
} from 'react-native';
import {Colors, FontSize} from '../theme/constant';

type FontWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

type Variant = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'title';

interface CustomTextProps extends RNTextProps {
  children?: React.ReactNode;
  variant?: Variant;
  color?: keyof typeof Colors | string;
  fontWeight?: FontWeight;
  fontFamily?: string;
  lineHeight?: number;
  textAlign?: TextStyle['textAlign'];
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  style?: TextStyle | TextStyle[];
  isRTL?: boolean;
  accessible?: boolean;
  accessibilityLabel?: string;
}

const CustomText = ({
  children,
  variant,
  color,
  fontWeight,
  fontFamily,
  lineHeight,
  textAlign,
  numberOfLines,
  ellipsizeMode = 'tail',
  style,
  isRTL = I18nManager.isRTL,
  accessible = true,
  accessibilityLabel,
  ...rest
}: CustomTextProps) => {
  if (children === null || children === undefined || children === '')
    return null;

  // const computedColor = Colors[color as keyof typeof Colors] ?? color;

  return (
    <RNText
      {...rest}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel ?? String(children)}
      style={[
        {
          fontSize:
            variant && FontSize[variant] ? FontSize[variant] : FontSize.md,
          fontWeight: fontWeight ? fontWeight : '500',
          color: color ? color : Colors.text,
          textAlign: textAlign ? textAlign : 'left',
          fontFamily: fontFamily ? fontFamily : 'Poppins-Bold',
        },
        style && style,
      ]}>
      {children}
    </RNText>
  );
};

export default CustomText;
const styles = StyleSheet.create({});
