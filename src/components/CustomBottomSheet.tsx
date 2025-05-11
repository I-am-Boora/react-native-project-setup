import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {Colors, BorderRadius} from '../theme/constant';

interface CustomBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  height?: number;
  children: React.ReactNode;
  sheetStyle?: StyleProp<ViewStyle>;
  backdropColor?: string;
  swipeToClose?: boolean;
}

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({
  visible,
  onClose,
  height = SCREEN_HEIGHT * 0.5,
  children,
  sheetStyle,
  backdropColor = 'rgba(0,0,0,0.5)',
  swipeToClose = true,
}) => {
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, height, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return swipeToClose && gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          onClose();
        } else {
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  if (!visible) return null; // 🔥 Only render if visible

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.backdrop, {backgroundColor: backdropColor}]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          {
            height,
            transform: [{translateY}],
          },
          sheetStyle,
        ]}
        {...(swipeToClose ? panResponder.panHandlers : {})}>
        {children}
      </Animated.View>
    </Modal>
  );
};

export default CustomBottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    overflow: 'hidden',
    padding: 16,
  },
});
