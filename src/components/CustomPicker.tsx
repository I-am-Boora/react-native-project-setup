import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  FlatList,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  TextInput,
} from 'react-native';
import {
  Colors,
  FontSize,
  Padding,
  BorderRadius,
  WindowWidth,
} from '../theme/constant';
import Modal from 'react-native-modal';
interface PickerOption {
  label: string;
  value: string | number;
}

interface CustomPickerProps {
  label?: string;
  selectedValue: string | number | null;
  onValueChange: (value: string | number) => void;
  options: PickerOption[];
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  pickerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  error?: string;
  showSearchBar?: boolean; // 🆕
  searchPlaceholder?: string; // 🆕
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  label,
  selectedValue,
  onValueChange,
  options,
  placeholder = 'Select an option',
  containerStyle,
  labelStyle,
  pickerStyle,
  textStyle,
  error,
  showSearchBar = false,
  searchPlaceholder = 'Search...',
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchText.toLowerCase()),
  );

  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.picker,
          {
            borderColor: error ? Colors.error : Colors.border,
          },
          pickerStyle,
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}>
        <Text style={[styles.text, textStyle]}>
          {selectedLabel || placeholder}
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            {showSearchBar && (
              <TextInput
                placeholder={searchPlaceholder}
                value={searchText}
                onChangeText={setSearchText}
                style={styles.searchInput}
                placeholderTextColor={Colors.muted}
              />
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                    setSearchText('');
                  }}>
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.noResultsText}>No options found</Text>
              }
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomPicker;

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
  picker: {
    borderWidth: 1.2,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Padding.sm,
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: WindowWidth,
    alignSelf: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    maxHeight: '60%',
  },
  searchInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 8,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  noResultsText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
});
