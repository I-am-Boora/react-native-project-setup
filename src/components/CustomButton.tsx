import React, {useState, useRef, useCallback} from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  GestureResponderEvent,
  TextStyle,
  View,
} from 'react-native';
import {Colors, FontSize, BorderRadius, Padding} from '../theme/constant';

type ButtonType = 'primary' | 'secondary' | 'outline' | 'disabled';

interface CustomButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  type?: ButtonType;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  accessible?: boolean;
  accessibilityLabel?: string;
  debounceTime?: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
  icon,
  accessible = true,
  accessibilityLabel,
  debounceTime = 500,
}) => {
  const isDisabled = disabled || loading;
  const [pressed, setPressed] = useState(false);
  const debounceRef = useRef(false);

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      if (isDisabled || debounceRef.current || !onPress) return;

      debounceRef.current = true;
      onPress(event);

      setTimeout(() => {
        debounceRef.current = false;
      }, debounceTime);
    },
    [onPress, isDisabled, debounceTime],
  );

  const getBackgroundColor = () => {
    switch (type) {
      case 'primary':
        return Colors.primary;
      case 'secondary':
        return Colors.secondary;
      case 'outline':
        return 'transparent';
      case 'disabled':
        return Colors.muted;
      default:
        return Colors.primary;
    }
  };

  const getTextColor = () => {
    if (type === 'outline') return Colors.primary;
    if (type === 'disabled') return Colors.background;
    return Colors.background;
  };

  const getBorder = () => {
    return type === 'outline'
      ? {borderWidth: 1, borderColor: Colors.primary}
      : {};
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel ?? title}
      onPressIn={() => {
        if (!isDisabled) setPressed(true);
      }}
      onPressOut={() => {
        if (!isDisabled) setPressed(false);
      }}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          opacity: isDisabled ? 0.5 : pressed ? 0.6 : 1,
        },
        getBorder(),
        fullWidth && {width: '100%'},
        style,
      ]}>
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.text, {color: getTextColor()}, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: Padding.md,
    paddingHorizontal: Padding.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FontSize.md,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
  icon: {
    marginRight: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
