import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, TextInput, Alert} from 'react-native';
import {useAuth} from '../../../context/AuthContext';

const CustomerProfileScreen = ({navigation}) => {
  const {user, updateProfileData} = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!fullName.trim()) {
      Alert.alert('Lỗi', 'Họ và tên không được để trống.');
      return;
    }
    setLoading(true);
    try {
      console.log('Đang cập nhật hồ sơ với:', {
        fullName: fullName.trim(),
        phone: phone.trim(),
      });
      Alert.alert('Thành công', 'Cập nhật hồ sơ thành công!');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật hồ sơ. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ tên"
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Email (không thể thay đổi)"
        value={user?.email}
        editable={false}
        selectTextOnFocus={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại (ví dụ: 09xxxxxxxx)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
          onPress={handleUpdateProfile}
          disabled={loading}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Đổi mật khẩu"
          onPress={() => navigation.navigate('CustomerChangePassword')}
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
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default CustomerProfileScreen;
