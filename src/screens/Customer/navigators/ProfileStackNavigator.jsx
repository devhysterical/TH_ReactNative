import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import Customer Profile Screens
import CustomerProfileScreen from '../Profile/CustomerProfileScreen';
import CustomerChangePasswordScreen from '../Profile/CustomerChangePasswordScreen';

const Stack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CustomerProfile"
        component={CustomerProfileScreen}
        options={{title: 'My Profile'}}
      />
      <Stack.Screen
        name="CustomerChangePassword"
        component={CustomerChangePasswordScreen}
        options={{title: 'Change Password'}}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
