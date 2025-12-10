import {
  Button,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  handleBluetoothPermission,
  handleGPSPermission,
  handleLocationPermission,
} from "../Helper/permissionHandler";

const DeviceConnect = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOximeterMethod = async () => {
    const isPermission = await handleGPSPermission();
    if (isPermission) {
      console.log("access GPS permission");
      const isLocationPermission = await handleLocationPermission();
      if (isLocationPermission) {
        console.log("location permission accessed");
        const isBluetoothPermission = await handleBluetoothPermission();
        if (isBluetoothPermission) {
          console.log("bluetooth permission accessed");
          setIsModalVisible(true);
        }
      }
    }
  };

  const ANDROID_BLUETOOTH_PERMISSIONS = [
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  ];

  /**
   * Checks and requests Bluetooth permissions on Android.
   * Note: For iOS, you would typically use a library like 'react-native-permissions'
   * and check/request 'PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL' or 'BLUETOOTH_ALWAYS'.
   */
  const requestBluetoothPermissions = async () => {
    if (Platform.OS === "android") {
      if (Platform.Version >= 31) {
        // Android 12+
        try {
          const statuses = await PermissionsAndroid.requestMultiple(
            ANDROID_BLUETOOTH_PERMISSIONS
          );

          const granted = Object.values(statuses).every(
            (status) => status === PermissionsAndroid.RESULTS.GRANTED
          );
          return granted;
        } catch (err) {
          console.warn(err);
          return false;
        }
      } else if (Platform.Version >= 23) {
        // Android 6.0 to 11 needs Location for scanning
        // This is a simplification; a real-world app needs more robust checks
        const locationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return locationGranted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    // For other platforms (like iOS), you'd have platform-specific logic here
    return true; // Assume granted or not needed on other platforms/versions
  };

  const handleModalRequest = async () => {
    // 1. Hide the custom modal
    setIsModalVisible(false);

    // 2. Trigger the native permission request
    const granted = await requestBluetoothPermissions();

    // 3. Update the status

    if (granted) {
      console.log("Bluetooth permissions granted!");
      // Proceed with Bluetooth operations
    } else {
      console.log("Bluetooth permissions denied.");
      // Handle denial, e.g., prompt user to go to settings
    }
  };

  const BlueToothModal = () => {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>
                🤝 Bluetooth Access Required
              </Text>
              <Text style={styles.modalText}>
                We need Bluetooth access to find and connect to nearby devices.
                Tap **"Continue"** to open the system permission dialog.
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  title="Cancel"
                  onPress={() => setIsModalVisible(false)}
                  color="#888"
                />
                <Button
                  title="Continue"
                  onPress={() => {
                    handleModalRequest();
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        padding: 15,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={() => handleOximeterMethod()}
        activeOpacity={0.6}
        style={{
          backgroundColor: "#1581BF",
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          borderRadius: 12,
          width: "30%",
        }}
      >
        <Text style={{ color: "white" }}>Oximeter</Text>
      </TouchableOpacity>
      <BlueToothModal />
    </View>
  );
};

export default DeviceConnect;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});
