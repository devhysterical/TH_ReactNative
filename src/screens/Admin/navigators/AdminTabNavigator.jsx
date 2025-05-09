import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

import ServicesListScreen from '../Services/ServicesListScreen';
import TransactionsListScreen from '../Transactions/TransactionsListScreen';
import CustomersListScreen from '../Customers/CustomersListScreen';
import AdminProfileScreen from '../Profile/AdminProfileScreen';
import AdminsListScreen from '../Admins/AdminsListScreen';
import AdminDashboard from '../AdminDashboard';
import AddServiceScreen from '../Services/AddServiceScreen';
import ServiceDetailScreen from '../Services/ServiceDetailScreen';
import CustomerDetailScreen from '../Customers/CustomerDetailScreen';
import TransactionDetailScreen from '../Transactions/TransactionDetailScreen';
import AdminChangePasswordScreen from '../Profile/AdminChangePasswordScreen';

const Tab = createBottomTabNavigator();
const AdminStack = createNativeStackNavigator();

const renderTabBarIcon = (route, focused, color, size) => {
  let iconName;
  if (route.name === 'ServicesTab') {
    iconName = focused ? 'server' : 'server-outline';
  } else if (route.name === 'TransactionsTab') {
    iconName = focused ? 'receipt' : 'receipt-outline';
  } else if (route.name === 'CustomersTab') {
    iconName = focused ? 'people' : 'people-outline';
  } else if (route.name === 'AdminsTab') {
    iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
  } else if (route.name === 'ProfileTab') {
    iconName = focused ? 'person-circle' : 'person-circle-outline';
  }
  return <Icon name={iconName} size={size} color={color} />;
};

function AdminStackNavigator() {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{title: 'Admin Dashboard'}}
      />
      <AdminStack.Screen
        name="ServicesList"
        component={ServicesListScreen}
        options={{title: 'Quản lý Dịch vụ'}}
      />
      <AdminStack.Screen
        name="AddService"
        component={AddServiceScreen}
        options={{title: 'Thêm Dịch vụ'}}
      />
      <AdminStack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{title: 'Chi tiết Dịch vụ'}}
      />
      <AdminStack.Screen
        name="CustomersList"
        component={CustomersListScreen}
        options={{title: 'Quản lý Khách hàng'}}
      />
      <AdminStack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={{title: 'Chi tiết Khách hàng'}}
      />
      <AdminStack.Screen
        name="TransactionsList"
        component={TransactionsListScreen}
        options={{title: 'Quản lý Giao dịch'}}
      />
      <AdminStack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{title: 'Chi tiết Giao dịch'}}
      />
      <AdminStack.Screen
        name="AdminProfile"
        component={AdminProfileScreen}
        options={{title: 'Thông tin cá nhân Admin'}}
      />
      <AdminStack.Screen
        name="AdminChangePassword"
        component={AdminChangePasswordScreen}
        options={{title: 'Đổi mật khẩu Admin'}}
      />
      <AdminStack.Screen
        name="AdminsList"
        component={AdminsListScreen}
        options={{title: 'Danh sách Quản trị viên'}}
      />
    </AdminStack.Navigator>
  );
}

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) =>
          renderTabBarIcon(route, focused, color, size),
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}>
      <Tab.Screen
        name="ServicesTab"
        component={ServicesListScreen}
        options={{title: 'Dịch Vụ'}}
      />
      <Tab.Screen
        name="TransactionsTab"
        component={TransactionsListScreen}
        options={{title: 'Giao Dịch'}}
      />
      <Tab.Screen
        name="CustomersTab"
        component={CustomersListScreen}
        options={{title: 'Khách Hàng'}}
      />
      <Tab.Screen
        name="AdminsTab"
        component={AdminsListScreen}
        options={{title: 'Quản Trị Viên'}}
      />
      <Tab.Screen
        name="ProfileTab"
        component={AdminProfileScreen}
        options={{title: 'Cá Nhân'}}
      />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;
