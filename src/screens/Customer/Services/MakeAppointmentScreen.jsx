import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {addAppointment} from '../../../services/firestore';

const MakeAppointmentScreen = ({route, navigation}) => {
  const {serviceId, serviceName, servicePrice} = route.params;
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || appointmentDate;
    setShowDatePicker(Platform.OS === 'ios');
    setAppointmentDate(currentDate);
    setSelectedTimeSlot(null);
  };

  const handleBookAppointment = async () => {
    if (!selectedTimeSlot) {
      Alert.alert('Chưa chọn', 'Vui lòng chọn thời gian.');
      return;
    }
    setLoading(true);
    try {
      const timeMatch = selectedTimeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);

      if (!timeMatch) {
        Alert.alert('Lỗi', 'Định dạng thời gian đã chọn không chính xác.');
        setLoading(false);
        return;
      }

      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3].toUpperCase();

      if (ampm === 'PM' && hours < 12) {
        hours += 12;
      } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
      }

      const bookingDateTime = new Date(appointmentDate);
      bookingDateTime.setHours(hours, minutes, 0, 0);

      if (isNaN(bookingDateTime.getTime())) {
        Alert.alert(
          'Lỗi',
          'Không thể tạo một ngày và giờ hợp lệ cho việc đặt lịch.',
        );
        setLoading(false);
        return;
      }

      const appointmentData = {
        serviceId,
        serviceName,
        servicePrice,
        appointmentDate: firestore.Timestamp.fromDate(bookingDateTime),
        timeSlot: selectedTimeSlot,
      };
      await addAppointment(appointmentData);
      Alert.alert(
        'Đã đặt lịch hẹn!',
        `Bạn đã đặt ${serviceName} vào ngày ${appointmentDate.toLocaleDateString()} lúc ${selectedTimeSlot}.`,
        [{text: 'OK', onPress: () => navigation.navigate('MyAppointments')}],
      );
    } catch (error) {
      Alert.alert('Lỗi đặt lịch', 'Không thể đặt lịch hẹn. ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt lịch hẹn</Text>
      <Text style={styles.serviceName}>Dịch vụ: {serviceName}</Text>
      <Text style={styles.serviceName}>
        Giá: ${servicePrice ? servicePrice.toFixed(2) : 'N/A'}
      </Text>

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.datePickerButton}>
        <Text style={styles.datePickerButtonText}>
          Chọn ngày: {appointmentDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {Platform.OS !== 'ios' && showDatePicker && (
        <Button
          title="Xác nhận chọn ngày"
          onPress={() => setShowDatePicker(false)}
        />
      )}

      <Text style={styles.timeSlotHeader}>
        Các khung giờ có sẵn cho {appointmentDate.toLocaleDateString()}:
      </Text>
      <View style={styles.timeSlotsContainer}>
        {timeSlots.map(slot => (
          <TouchableOpacity
            key={slot}
            style={[
              styles.timeSlotButton,
              selectedTimeSlot === slot && styles.selectedTimeSlotButton,
            ]}
            onPress={() => setSelectedTimeSlot(slot)}>
            <Text
              style={[
                styles.timeSlotText,
                selectedTimeSlot === slot && styles.selectedTimeSlotText,
              ]}>
              {slot}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <Button
            title="Xác nhận đặt lịch"
            onPress={handleBookAppointment}
            disabled={!selectedTimeSlot || loading}
          />
        )}
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
    marginBottom: 10,
    textAlign: 'center',
  },
  serviceName: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
    color: '#555',
  },
  datePickerButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  datePickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  timeSlotHeader: {
    fontSize: 17,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 10,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  timeSlotButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#007bff',
    margin: 6,
    minWidth: '40%',
    alignItems: 'center',
  },
  selectedTimeSlotButton: {
    backgroundColor: '#007bff',
  },
  timeSlotText: {
    color: '#007bff',
    fontSize: 15,
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
});

export default MakeAppointmentScreen;
