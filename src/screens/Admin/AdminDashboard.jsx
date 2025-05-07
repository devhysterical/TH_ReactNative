import React from 'react';
import {View, Text, Button, StyleSheet, ScrollView} from 'react-native';
import {useAuth} from '../../context/AuthContext';

const AdminDashboard = ({navigation}) => {
  const {logout, user} = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.welcomeText}>
          Xin chào, {user?.fullName || user?.email} (Admin)!
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Quản lý dịch vụ"
            onPress={() => navigation.navigate('ServicesList')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Quản lý giao dịch"
            onPress={() => navigation.navigate('TransactionsList')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Quản lý khách hàng"
            onPress={() => navigation.navigate('CustomersList')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Thông tin cá nhân"
            onPress={() => navigation.navigate('AdminProfile')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Đăng xuất" onPress={logout} color="#c0392b" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 30,
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
  },
});

export default AdminDashboard;
