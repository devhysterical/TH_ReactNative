import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const P3CustomComponent = ({text, _onPress, buttonStyle}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={_onPress}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default P3CustomComponent;
