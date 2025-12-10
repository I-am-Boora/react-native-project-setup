// src/screens/ProfileScreen.tsx

import React, { useCallback, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { ImagePickerActionSheet } from "../components/ImagePickerActionSheet";
import { PickerAsset } from "../hooks/useImagePicker";
import { Heading, BodyText } from "../components/Typography";

import { COLORS, SPACING } from "../theme/constant";

export const ProfileScreen = () => {
  const [selectedAsset, setSelectedAsset] = useState<PickerAsset | null>(null);

  const handleAssetSelection = useCallback((assets: PickerAsset[]) => {
    // Note: If you needed to use state (like 'theme' or 'someOtherState') inside here,
    // you would need to add it to the dependency array [].
    if (assets.length > 0) {
      console.log("assests:---", assets);
      // Since we limit selection to 1, we take the first asset
      setSelectedAsset(assets[0]);
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: "#f5f5f5" }]}>
      <Heading style={{ color: selectedAsset ? COLORS.primary : COLORS.text }}>
        {selectedAsset ? "Image Selected!" : "Upload Profile Picture"}
      </Heading>

      {selectedAsset && selectedAsset.uri ? (
        <Image
          source={{ uri: selectedAsset.uri }}
          style={styles.imagePreview}
        />
      ) : (
        <View style={styles.placeholder}>
          <BodyText style={{ color: COLORS.muted }}>No image selected</BodyText>
        </View>
      )}

      <ImagePickerActionSheet
        triggerTitle="Upload"
        onAssetsSelected={handleAssetSelection}
      />

      {/* <ImagePickerButton
        triggerTitle="Pick from Gallery"
        onAssetsSelected={handleAssetSelection}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.xl,
    alignItems: "center",
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginVertical: SPACING.lg,
    borderWidth: 3,
    borderColor: COLORS.border,
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginVertical: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
  },
});
