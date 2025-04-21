import React from 'react'; // Thêm import React
import {View, Text, StyleSheet} from 'react-native';

const P1HelloWorld = () => {
  return (
    <View style={styles.container}>
      {/* Hộp chứa text */}
      <View style={styles.box}>
        <Text style={styles.text}>Hello, world!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  box: {
    backgroundColor: '#ADD8E6', // Màu nền xanh nhạt
    padding: 20,
  },
  text: {
    color: '#000',
    fontSize: 16,
  },
});

export default P1HelloWorld;
