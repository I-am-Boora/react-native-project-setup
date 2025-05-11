import React, {useState, useRef} from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  StyleSheet,
  I18nManager,
  ViewStyle,
  TextStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import {Colors, FontSize, Padding, BorderRadius} from '../theme/constant';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  showToggleVisibility?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  secureTextEntry,
  showToggleVisibility = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(secureTextEntry);
  const inputRef = useRef<TextInput>(null);

  const toggleVisibility = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: error
              ? Colors.error
              : isFocused
              ? Colors.primary
              : Colors.border,
          },
        ]}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {textAlign: I18nManager.isRTL ? 'right' : 'left'},
            inputStyle,
          ]}
          placeholderTextColor={Colors.muted}
          secureTextEntry={hidePassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessible
          accessibilityLabel={label}
          {...rest}
        />
        {secureTextEntry && showToggleVisibility && (
          <TouchableOpacity onPress={toggleVisibility}>
            <Text style={styles.eyeText}>{hidePassword ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: FontSize.sm,
    marginBottom: 6,
    color: Colors.text,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Padding.sm,
    paddingVertical: 10,
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.text,
    padding: 0,
  },
  eyeText: {
    fontSize: FontSize.lg,
    paddingHorizontal: 6,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.xs,
    marginTop: 4,
  },
});
