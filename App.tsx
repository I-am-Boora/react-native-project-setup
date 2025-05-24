/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from "react";
import type { PropsWithChildren } from "react";
import {
  Button,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

// import { Colors, FontSize, Margin } from "./src/theme/constant";
import Assesment from "./src/official work/Assesment";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Margin } from "./src/theme/constant";
import Onboarding from "./src/animation/onboarding/onboarding";

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  const [selected, setSelected] = useState<string | number>("option1");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setemailError] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | number | null>(
    null
  );
  const [isSheetVisible, setSheetVisible] = useState(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [showAlert, setShowAlert] = useState(false);
  const handleEmail = (val: string) => {
    setEmail(val);
    if (!val.includes("@")) {
      setemailError("Enter valid email");
    } else if (val === "") {
      setemailError("");
    } else {
      setemailError("");
    }
  };
  const handleDelete = () => {
    console.log("message deleted");
    setShowAlert(false);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <CustomText
        variant="xxl"
        color={Colors.primary}
        fontWeight="bold"
        textAlign="center"
        style={styles.textStyles}>
        Welcome to your app!
      </CustomText>
      <CustomButton
        title="Login"
        onPress={() => console.log('Pressed1')}
        type="disabled"
        loading={false}
        fullWidth
      />
      <CustomSpinner size={50} color={Colors.secondary} />
      <Loader />
      <RadioButton
        options={[
          {label: 'Option 1', value: 'option1'},
          {label: 'Option 2', value: 'option2'},
        ]}
        selectedValue={selected}
        onChange={val => setSelected(val)}
        color={Colors.primary}
        direction="column"
      />
      <CustomTextInput
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={handleEmail}
        error={emailError}
      />

      <CustomTextInput
        label="Password"
        placeholder="Enter your password"
        secureTextEntry
        showToggleVisibility
        value={password}
        onChangeText={setPassword}
      />
      <CustomPicker
        label="Choose Category"
        selectedValue={selectedItem}
        onValueChange={setSelectedItem}
        showSearchBar={true}
        options={[
          {label: 'Food', value: 'food'},
          {label: 'Travel', value: 'travel'},
          {label: 'Shopping', value: 'shopping'},
          {label: 'Food', value: 'food'},
          {label: 'Travel', value: 'travel'},
          {label: 'Shopping', value: 'shopping'},
          {label: 'Food', value: 'food'},
          {label: 'Travel', value: 'travel'},
          {label: 'Shopping', value: 'shopping'},
          {label: 'Food', value: 'food'},
          {label: 'Travel', value: 'travel'},
          {label: 'Shopping', value: 'shopping'},
          {label: 'Food', value: 'food'},
          {label: 'Travel', value: 'travel'},
          {label: 'Shopping', value: 'shopping'},
          {label: 'Food', value: 'food'},
          {label: 'Travel', value: 'travel'},
          {label: 'Shopping', value: 'shopping'},
          {label: 'Food', value: 'food'},
          {label: 'Travel', value: 'travel'},
          {label: 'Shopping', value: 'shopping'},
          {label: 'Food', value: 'food'},
          {label: 'Travel', value: 'travel'},
          {label: 'Shopping', value: 'shopping'},
        ]}
        placeholder="Pick a category"
      /> */}
      {/* <CustomBottomSheet
        visible={isSheetVisible}
        onClose={() => setSheetVisible(false)}
        height={150}
        swipeToClose>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>
          Hello from the Bottom Sheet!
        </Text>
        <Button title="Close" onPress={() => setSheetVisible(false)} />
      </CustomBottomSheet>

      <Button title="Open Bottom Sheet" onPress={() => setSheetVisible(true)} /> */}
      {/* <RNHeader /> */}
      {/* <RNAlert
        isVisible={showAlert}
        title="Delete Confirmation"
        message="Are you sure you want to delete this file?"
        onCancel={() => setShowAlert(false)}
        onConfirm={handleDelete}
        // cancelText="No"
        // showCancelButton={false}
        // confirmText="Yes, Delete"
        // containerStyle={{backgroundColor: '#fff'}}
        // confirmButtonTextStyle={{color: 'white'}}
        // buttonStyle={{backgroundColor: Colors.primary}}
      /> */}
      {/* <Pressable onPress={() => setShowAlert(true)}>
        <Text>show alert</Text>
      </Pressable> */}
      {/* <Assesment /> */}
      <Onboarding />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  textStyles: { marginTop: Margin.sm },
});

export default App;
