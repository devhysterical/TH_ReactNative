import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAuth} from '../../../context/AuthContext';

import CustomerTabNavigator from './CustomerTabNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const {logout} = useAuth();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Đăng xuất"
        icon={({color, size}) => (
          <Ionicons name="log-out-outline" color={color} size={size} />
        )}
        onPress={() => logout()}
      />
    </DrawerContentScrollView>
  );
}

const CustomerDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen
        name="HomeTabs"
        component={CustomerTabNavigator}
        options={{
          title: 'Trang chủ',
          drawerIcon: ({color, size}) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          title: 'Trang cá nhân',
          drawerIcon: ({color, size}) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default CustomerDrawerNavigator;
