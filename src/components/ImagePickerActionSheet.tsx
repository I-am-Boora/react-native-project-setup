import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
  Animated, // Import Animated API
  Easing, // Import Easing for better animation curve
} from "react-native";

import { useImagePicker, PickerAsset } from "../hooks/useImagePicker";
import { BodyText } from "./Typography"; // Assuming these are available
import { COLORS, SPACING, BORDER_RADIUS } from "../theme/constant";

const { height: screenHeight } = Dimensions.get("window");
const ANIMATION_DURATION = 300;

// Define props for the component
interface ImagePickerActionSheetProps {
  onAssetsSelected: (assets: PickerAsset[]) => void;
  triggerTitle: string;
}
type ActionType = "camera" | "gallery";
export const ImagePickerActionSheet = ({
  onAssetsSelected,
  triggerTitle,
}: ImagePickerActionSheetProps) => {
  const { assets, error, loading, pickImage, clearAssets } = useImagePicker();
  const [pendingAction, setPendingAction] = useState<ActionType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Animated values
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(screenHeight)).current;

  // --- Animation Logic ---

  const animateIn = useCallback(() => {
    // 1. Fade In Overlay
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();

    // 2. Slide Up Content
    Animated.timing(contentTranslateY, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.ease), // Smooth out animation
      useNativeDriver: true,
    }).start();
  }, [overlayOpacity, contentTranslateY]);

  const animateOut = useCallback(
    (callback: () => void) => {
      // 1. Slide Down Content
      Animated.timing(contentTranslateY, {
        toValue: screenHeight,
        duration: ANIMATION_DURATION,
        easing: Easing.in(Easing.ease), // Smooth in animation
        useNativeDriver: true,
      }).start();

      // 2. Fade Out Overlay (must wait for content slide or they fade together)
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(callback); // Execute callback (setModalVisible(false)) when fade is complete
    },
    [overlayOpacity, contentTranslateY]
  );

  const openModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setPendingAction(null);
    animateOut(() => {
      setModalVisible(false);
    });
  }, [animateOut]);

  // Handle modal mount/unmount and animation trigger
  useEffect(() => {
    console.log("is imagepicker render");
    if (modalVisible) {
      animateIn();
    }
    // We don't need an 'else' block here because the close logic is handled by animateOut's callback
  }, [modalVisible, animateIn]);

  // --- Image Picker Handlers (Unchanged) ---

  const handlePick = useCallback(
    async (type: "camera" | "gallery") => {
      setPendingAction(type);
      // Start slide-out animation and hide modal when complete
      await pickImage(type);
      closeModal();
      setPendingAction(null);
    },
    [pickImage, closeModal]
  );

  // --- Effects for hook feedback (Unchanged) ---
  useEffect(() => {
    if (assets && assets.length > 0) {
      onAssetsSelected(assets);
      clearAssets();
      setPendingAction(null);
    }
  }, [assets, onAssetsSelected, clearAssets]);

  // useEffect(() => {
  //   if (error && !loading) {
  //     setPendingAction(null);
  //     Alert.alert(
  //       "Image Selection Failed",
  //       error,
  //       [{ text: "OK", onPress: clearAssets }],
  //       { cancelable: false }
  //     );
  //   }
  // }, [error, loading, clearAssets]);

  // --- Helper Component for Modal Buttons (Unchanged) ---

  interface ActionButtonProps {
    title: string;
    action: () => void;
    isCancel?: boolean;
    isFirst?: boolean;
    type: ActionType;
    isLast?: boolean;
  }

  const ActionButton = ({
    title,
    action,
    type,
    isCancel,
    isFirst,
    isLast,
  }: ActionButtonProps) => {
    const isLoading = loading && pendingAction === type;
    const buttonStyle = [
      styles.actionButton,
      isCancel ? styles.cancelButton : { backgroundColor: COLORS.background },
      isFirst && !isCancel && styles.firstAction,
      isLast && !isCancel && styles.lastAction,
      !isCancel && { borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth },
      !isCancel && { borderColor: COLORS.border },
    ];

    const textStyle = [
      styles.actionText,
      isCancel ? { color: COLORS.primary } : { color: COLORS.text },
      isCancel && { fontWeight: "600" as "600" },
      !isCancel && { fontWeight: "400" as "400" },
    ];

    return (
      <TouchableOpacity
        style={buttonStyle}
        onPress={action}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.primary} size="small" />
        ) : (
          <BodyText style={textStyle}>{title}</BodyText>
        )}
      </TouchableOpacity>
    );
  };

  // --- Render ---

  return (
    <View>
      {/* Trigger Button */}
      <TouchableOpacity
        style={[styles.triggerButton, { backgroundColor: COLORS.primary }]}
        onPress={openModal}
        activeOpacity={0.8}
      >
        <BodyText style={styles.triggerText}>{triggerTitle}</BodyText>
      </TouchableOpacity>

      {/* Action Sheet Modal */}
      <Modal
        animationType="none" // Custom animation handled by Animated API
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Animated.View // Animated Overlay for Fade Effect
          style={[styles.modalOverlay, { opacity: overlayOpacity }]}
        >
          <TouchableOpacity // Full-screen area to dismiss modal
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeModal}
          />

          <Animated.View // Animated Content for Slide Effect
            style={[
              styles.modalContent,
              { transform: [{ translateY: contentTranslateY }] },
            ]}
          >
            {/* Action Group Container */}
            <View style={styles.actionGroup}>
              <ActionButton
                title="Take Photo"
                action={() => handlePick("camera")}
                isFirst={true}
                isLoading={loading}
              />
              <ActionButton
                title="Choose from Gallery"
                action={() => handlePick("gallery")}
                isLast={true}
                isLoading={loading}
              />
            </View>

            {/* Cancel Button - In its own container for margin */}
            <View style={styles.cancelButtonContainer}>
              <ActionButton
                title="Cancel"
                action={closeModal}
                isCancel={true}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // --- Trigger Button Styles ---
  triggerButton: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    marginVertical: SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  triggerText: {
    color: COLORS.background,
    fontWeight: "600" as "600",
    fontSize: 18,
  },

  // --- Modal & Overlay Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Base background color
    justifyContent: "flex-end",
  },
  modalContent: {
    // Note: This container now only manages vertical layout, not opacity/position
    paddingBottom: Platform.OS === "ios" ? SPACING.xxl : SPACING.lg,
    backgroundColor: "transparent",
  },

  // --- Action Button Group Styles (iOS Style) ---
  actionGroup: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
    overflow: "hidden",
  },
  actionButton: {
    padding: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  actionText: {
    fontSize: 18,
  },

  // First/Last button styling for border radius and separation
  firstAction: {
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
  },
  lastAction: {
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },

  // Cancel Button Container (Used for margin)
  cancelButtonContainer: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
  },
  // Cancel Button Styling
  cancelButton: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.xl,
  },
});
