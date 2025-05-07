// filepath: src/screens/Admin/Profile/AdminProfileScreen.jsx
import React from 'react';
import {View, Text, Button, StyleSheet, TextInput, Alert} from 'react-native';
import {useAuth} from '../../../context/AuthContext';

const AdminProfileScreen = ({navigation}) => {
  const {user, updateProfile} = useAuth();

  const handleUpdate = async () => {
    Alert.alert('Đã cập nhật thông tin cá nhân thành công!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Profile</Text>
      <TextInput placeholder="Họ tên" style={styles.input} />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={user?.email}
        editable={false}
      />
      <Button title="Cập nhật thông tin cá nhân" onPress={handleUpdate} />
      <View style={styles.buttonSpacer} />
      <Button
        title="Đổi mật khẩu"
        onPress={() => navigation.navigate('AdminChangePassword')}
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
  buttonSpacer: {marginVertical: 10},
});
export default AdminProfileScreen;
