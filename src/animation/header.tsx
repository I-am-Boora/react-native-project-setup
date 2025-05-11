import React, {useRef} from 'react';
import {
  Animated,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const RNHeader = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const data = [
    'Profile',
    'Account Settings',
    'Privacy',
    'Security',
    'Notifications',
    'Language',
    'Theme',
    'App Appearance',
    'Blocked Users',
    'Change Password',
    'Location Settings',
    'Data Usage',
    'Backup & Restore',
    'Subscription',
    'Payment Methods',
    'Help & Support',
    'Terms of Service',
    'About App',
    'Logout',
    'Delete Account',
  ];

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.item}>
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  // Animation values
  const translateY = scrollY.interpolate({
    inputRange: [0, 120], // Adjust this scroll distance to match layout height
    outputRange: [0, -80], // Fully move up to align with header
    extrapolate: 'clamp',
  });

  const scale = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [1, 0.8], // Shrinks only a bit
    extrapolate: 'clamp',
  });

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={'lightblue'} />
      <View style={styles.headerContainer}>
        <SafeAreaView>
          <View style={styles.headerTopRow}>
            <Text>Back</Text>
            <Text>Delete</Text>
          </View>

          <Animated.View
            style={[
              styles.profileView,
              {
                transform: [{translateY}, {scale}],
              },
            ]}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/31869042/pexels-photo-31869042/free-photo-of-woman-pointing-at-camera-by-lake-at-sunset.jpeg?auto=compress&cs=tinysrgb&w=1200',
              }}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.profileName}>Katharin Langford</Text>
              <Text style={styles.profileStatus}>online</Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>

      <Animated.FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{paddingTop: 0, paddingBottom: 20}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default RNHeader;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'lightblue',
    width: '100%',
    height: 200,
    alignSelf: 'center',
    borderRadius: 15,
    marginBottom: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  profileView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    marginTop: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 25,
  },
  profileName: {
    fontSize: 18,
    paddingLeft: 20,
  },
  profileStatus: {
    paddingLeft: 20,
  },
  item: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 10,
    padding: 10,
    marginHorizontal: 10,
  },
});
