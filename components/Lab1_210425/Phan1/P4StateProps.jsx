import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

// Component con nhận props
const Greeting = props => {
  return <Text style={styles.propText}>Prop Message: {props.message}</Text>;
};
// Component cha quản lý state và truyền props
const P4StateProps = () => {
  // State: Giá trị có thể thay đổi
  const [count, setCount] = useState(0);
  // Props: Giá trị khởi tạo, không thay đổi trong component này
  const initialGreeting = 'Hello from Parent!';

  const incrementCount = () => {
    setCount(count + 1);
  };

  return (
    <View style={styles.container}>
      {/* Truyền props 'message' cho component Greeting */}
      <Greeting message={initialGreeting} />

      <View style={styles.stateContainer}>
        <Text style={styles.stateText}>State Count: {count}</Text>
        <Button title="Increment Count" onPress={incrementCount} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  propText: {
    fontSize: 18,
    color: 'blue',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  stateContainer: {
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
  },
  stateText: {
    fontSize: 18,
    color: 'green',
    marginBottom: 10,
    fontWeight: 'bold',
  },
});

export default P4StateProps;
