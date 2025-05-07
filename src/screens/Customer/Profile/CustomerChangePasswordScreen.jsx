import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, TextInput, Alert} from 'react-native';
import {useAuth} from '../../../context/AuthContext';

const CustomerChangePasswordScreen = ({navigation}) => {
  const {changeUserPassword} = useAuth(); // Assuming changeUserPassword exists in AuthContext
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Lỗi xác nhận', 'Tất cả các trường đều bắt buộc.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Lỗi xác nhận', 'Mật khẩu mới không khớp.');
      return;
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      Alert.alert(
        'Lỗi xác nhận',
        'Mật khẩu mới phải có ít nhất 8 ký tự (bao gồm ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và 1 ký tự đặc biệt).',
      );
      return;
    }

    setLoading(true);
    try {
      console.log('Đang thay đổi mật khẩu...');
      Alert.alert('Thành công', 'Mật khẩu đã được thay đổi thành công!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thay đổi mật khẩu. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thay đổi mật khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu hiện tại"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <Text style={styles.hintText}>
        Tối thiểu 8 ký tự, bao gồm ít nhất một chữ cái viết hoa, một chữ cái
        viết thường, một số và 1 ký tự đặc biệt.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Xác nhận lại mật khẩu mới"
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Đang thay đổi...' : 'Đổi mật khẩu'}
          onPress={handleChangePassword}
          disabled={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  hintText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  buttonContainer: {
    marginTop: 15,
  },
});

export default CustomerChangePasswordScreen;
