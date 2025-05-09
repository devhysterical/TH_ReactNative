import React from 'react';
import {View, Text, Button, StyleSheet, Alert} from 'react-native';
import {useAuth} from '../../../context/AuthContext';

const AdminProfileScreen = ({navigation}) => {
  const {user, logout} = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất không?',
      [
        {text: 'Hủy', style: 'cancel'},
        {text: 'Đăng xuất', onPress: () => logout(), style: 'destructive'},
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Họ tên:</Text>
        <Text style={styles.value}>{user?.fullName || 'N/A'}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || 'N/A'}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Vai trò:</Text>
        <Text style={styles.value}>
          {user?.role === 'admin' ? 'Quản trị viên' : 'N/A'}
        </Text>
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          title="Đổi mật khẩu"
          onPress={() => navigation.navigate('AdminChangePassword')}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <Button title="Đăng xuất" onPress={handleLogout} color="#c0392b" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  buttonWrapper: {
    marginTop: 20,
  },
});

export default AdminProfileScreen;
