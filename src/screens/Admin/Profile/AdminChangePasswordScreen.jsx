import React from 'react';
import {View, Text, Button, StyleSheet, TextInput, Alert} from 'react-native';
import {useAuth} from '../../../context/AuthContext';

const AdminChangePasswordScreen = ({navigation}) => {
  const {changePassword} = useAuth();

  const handleChangePassword = async () => {
    Alert.alert('Thông tin', 'Chức năng thay đổi mật khẩu sẽ được triển khai.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Thay đổi mật khẩu</Text>
      <TextInput
        placeholder="Mật khẩu hiện tại"
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Mật khẩu mới"
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Xác nhận lại mật khẩu mới"
        style={styles.input}
        secureTextEntry
      />
      <Button title="Chấp nhận mật khẩu mới" onPress={handleChangePassword} />
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
export default AdminChangePasswordScreen;
