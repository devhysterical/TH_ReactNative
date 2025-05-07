import React from 'react';
import {View, Text, Button, StyleSheet, TextInput} from 'react-native';

const CustomerDetailScreen = ({route, navigation}) => {
  const {customerId} = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thông tin khách hàng (ID: {customerId})</Text>
      <TextInput placeholder="Họ tên" style={styles.input} />
      <TextInput placeholder="Email" style={styles.input} editable={false} />
      <Button
        title="Cập nhật khách hàng"
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
export default CustomerDetailScreen;
