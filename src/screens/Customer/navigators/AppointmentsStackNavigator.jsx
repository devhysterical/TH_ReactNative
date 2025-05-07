import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import Customer Appointment Screens
import MyAppointmentsScreen from '../Appointments/MyAppointmentsScreen';
import AppointmentDetailScreen from '../Appointments/AppointmentDetailScreen';

const Stack = createNativeStackNavigator();

const AppointmentsStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyAppointments"
        component={MyAppointmentsScreen}
        options={{title: 'Lịch hẹn của tôi'}}
      />
      <Stack.Screen
        name="CustomerAppointmentDetail"
        component={AppointmentDetailScreen}
        options={{title: 'Chi tiết cuộc hẹn'}}
      />
    </Stack.Navigator>
  );
};

export default AppointmentsStackNavigator;
