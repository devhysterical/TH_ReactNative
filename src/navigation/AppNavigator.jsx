import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native'; // Thêm ActivityIndicator và StyleSheet
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';

// Customer Navigator
import CustomerDrawerNavigator from '../screens/Customer/navigators/CustomerDrawerNavigator';

// Admin Screens
import AdminTabNavigator from '../screens/Admin/navigators/AdminTabNavigator';
import AddServiceScreen from '../screens/Admin/Services/AddServiceScreen';
import ServiceDetailScreen from '../screens/Admin/Services/ServiceDetailScreen';
import TransactionDetailScreen from '../screens/Admin/Transactions/TransactionDetailScreen';
import CustomerDetailScreen from '../screens/Admin/Customers/CustomerDetailScreen';
import AdminChangePasswordScreen from '../screens/Admin/Profile/AdminChangePasswordScreen';

const Stack = createNativeStackNavigator();

// Component màn hình Loading
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007bff" />
  </View>
);

const AppNavigator = () => {
  // Sử dụng authStatus thay vì loading
  const {authStatus, isAuthenticated, isAdmin} = useAuth();

  // Hiển thị màn hình loading khi đang khởi tạo hoặc xử lý
  if (authStatus === 'initializing' || authStatus === 'processing') {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        isAdmin ? (
          <>
            <Stack.Screen name="AdminRoot" component={AdminScreensNavigator} />
          </>
        ) : (
          <Stack.Screen
            name="CustomerRoot"
            component={CustomerDrawerNavigator}
          />
        )
      ) : (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{headerShown: false, title: 'Tạo tài khoản'}}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{headerShown: false, title: 'Quên mật khẩu'}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const AdminScreensNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AdminMainTabs"
      component={AdminTabNavigator}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="AddService"
      component={AddServiceScreen}
      options={{headerShown: true, title: 'Thêm dịch vụ mới'}}
    />
    <Stack.Screen
      name="ServiceDetail"
      component={ServiceDetailScreen}
      options={{headerShown: true, title: 'Chi tiết dịch vụ'}}
    />
    <Stack.Screen
      name="TransactionDetail"
      component={TransactionDetailScreen}
      options={{headerShown: true, title: 'Chi tiết giao dịch'}}
    />
    <Stack.Screen
      name="CustomerDetail"
      component={CustomerDetailScreen}
      options={{headerShown: true, title: 'Chi tiết khách hàng'}}
    />
    <Stack.Screen
      name="AdminChangePassword"
      component={AdminChangePasswordScreen}
      options={{headerShown: true, title: 'Đổi mật khẩu'}}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
});

export default AppNavigator;
