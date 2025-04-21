import React from 'react';
import {StyleSheet, View, Button, Alert} from 'react-native';

const P2CapturingTaps = () => {
  const handlePress = () => {
    Alert.alert('hello LamTuanKiet');
  };

  return (
    <View style={styles.container}>
      <Button title="Press Me" onPress={handlePress} />
    </View>
  );
};

export default P2CapturingTaps;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
