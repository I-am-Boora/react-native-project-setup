import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  I18nManager,
} from 'react-native';
import {Colors, FontSize} from '../theme/constant';

interface RadioButtonOption {
  label: string;
  value: string | number;
}

interface CustomRadioButtonProps {
  options: RadioButtonOption[];
  selectedValue: string | number;
  onChange: (value: string | number) => void;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  circleSize?: number;
  color?: string;
  direction?: 'row' | 'column';
}

const RadioButton: React.FC<CustomRadioButtonProps> = ({
  options,
  selectedValue,
  onChange,
  containerStyle,
  labelStyle,
  circleSize = 20,
  color = Colors.primary,
  direction = 'column',
}) => {
  return (
    <View style={[styles.group, {flexDirection: direction}, containerStyle]}>
      {options.map((opt, idx) => {
        const isSelected = selectedValue === opt.value;

        return (
          <TouchableOpacity
            key={idx}
            onPress={() => onChange(opt.value)}
            style={styles.option}
            accessibilityRole="radio"
            accessibilityState={{selected: isSelected}}
            accessibilityLabel={opt.label}>
            <View
              style={[
                styles.circle,
                {
                  borderColor: color,
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                },
              ]}>
              {isSelected && (
                <View
                  style={[
                    styles.innerCircle,
                    {
                      backgroundColor: color,
                      width: circleSize / 2,
                      height: circleSize / 2,
                      borderRadius: circleSize / 4,
                    },
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                styles.label,
                {
                  marginLeft: I18nManager.isRTL ? 0 : 8,
                  marginRight: I18nManager.isRTL ? 8 : 0,
                },
                labelStyle,
              ]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  group: {
    gap: 12,
  },
  option: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
  },
  circle: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {},
  label: {
    fontSize: FontSize.sm,
    color: Colors.text,
  },
});
