import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import Customer Service Screens
import CustomerServicesListScreen from '../Services/CustomerServicesListScreen';
import CustomerServiceDetailScreen from '../Services/CustomerServiceDetailScreen';
import MakeAppointmentScreen from '../Services/MakeAppointmentScreen';

const Stack = createNativeStackNavigator();

const ServicesStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CustomerServicesList"
        component={CustomerServicesListScreen}
        options={{title: 'Dịch vụ của chúng tôi'}}
      />
      <Stack.Screen
        name="CustomerServiceDetail"
        component={CustomerServiceDetailScreen}
        options={{title: 'Chi tiết dịch vụ'}}
      />
      <Stack.Screen
        name="MakeAppointment"
        component={MakeAppointmentScreen}
        options={{title: 'Đặt lịch hẹn'}}
      />
    </Stack.Navigator>
  );
};

export default ServicesStackNavigator;
