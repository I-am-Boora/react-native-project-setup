import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal as RNModal,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Colors, FontSize} from '../theme/constant';

interface AlertProps {
  isVisible: boolean;
  title?: string;
  message?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  showCancelButton?: boolean;
  customContent?: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
  buttonStyle?: ViewStyle;
  cancelButtonTextStyle?: TextStyle;
  confirmButtonTextStyle?: TextStyle;
}

const RNAlert: React.FC<AlertProps> = ({
  isVisible,
  title = 'Alert',
  message = '',
  onCancel,
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'OK',
  showCancelButton = true,
  customContent,
  containerStyle,
  titleStyle,
  messageStyle,
  buttonStyle,
  cancelButtonTextStyle,
  confirmButtonTextStyle,
}) => {
  return (
    <RNModal transparent visible={isVisible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.container, containerStyle]}>
          {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
          {message && (
            <Text style={[styles.message, messageStyle]}>{message}</Text>
          )}
          {customContent}
          <View style={styles.buttonRow}>
            {showCancelButton && (
              <TouchableOpacity
                style={[
                  styles.button,
                  buttonStyle,
                  {backgroundColor: 'transparent'},
                ]}
                onPress={onCancel}>
                <Text style={[styles.cancelText, cancelButtonTextStyle]}>
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, buttonStyle]}
              onPress={onConfirm}>
              <Text style={[styles.confirmText, confirmButtonTextStyle]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </RNModal>
  );
};

export default RNAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.md,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  cancelText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  confirmText: {
    color: 'white',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
