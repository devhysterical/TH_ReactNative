import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ServicesStackNavigator from './ServicesStackNavigator';
import AppointmentsStackNavigator from './AppointmentsStackNavigator';

const Tab = createBottomTabNavigator();

const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'ServicesTab') {
            iconName = focused ? 'list-circle' : 'list-circle-outline';
          } else if (route.name === 'MyAppointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen
        name="ServicesTab"
        component={ServicesStackNavigator}
        options={{title: 'Dịch vụ'}}
      />
      <Tab.Screen
        name="MyAppointments"
        component={AppointmentsStackNavigator}
        options={{title: 'Lịch hẹn của tôi'}}
      />
    </Tab.Navigator>
  );
};

export default CustomerTabNavigator;
