import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const NearbyScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Tính năng đang phát triển</Text>
      <Text style={styles.subMessage}>Coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  subMessage: {
    fontSize: 16,
    color: 'gray',
  },
});

export default NearbyScreen;
