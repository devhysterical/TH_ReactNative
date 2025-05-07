import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from '../../../services/firestore';

const AppointmentDetailScreen = ({route, navigation}) => {
  const {appointmentId} = route.params;
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newDate, setNewDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState('');

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];

  useFocusEffect(
    useCallback(() => {
      async function loadAppointmentData() {
        setLoading(true);
        try {
          const appDetails = await getAppointmentById(appointmentId);
          if (appDetails) {
            setAppointment(appDetails);
            setNewDate(
              appDetails.appointmentDate?.toDate
                ? appDetails.appointmentDate.toDate()
                : new Date(),
            );
            setNewTimeSlot(appDetails.timeSlot || '');
          } else {
            Alert.alert(
              'Không tìm thấy',
              'Chi tiết cuộc hẹn không thể tìm thấy.',
              [{text: 'OK', onPress: () => navigation.goBack()}],
            );
          }
        } catch (error) {
          Alert.alert(
            'Lỗi',
            'Không thể lấy chi tiết cuộc hẹn. ' + error.message,
          );
          navigation.goBack();
        } finally {
          setLoading(false);
        }
      }
      loadAppointmentData();
    }, [appointmentId, navigation]),
  );

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || newDate;
    setShowDatePicker(Platform.OS === 'ios');
    setNewDate(currentDate);
    setNewTimeSlot(null);
  };

  const handleUpdateAppointment = async () => {
    if (!newTimeSlot) {
      Alert.alert(
        'Không có lựa chọn',
        'Vui lòng chọn một khung giờ mới nếu thay đổi ngày/giờ.',
      );
      return;
    }
    setIsUpdating(true);
    try {
      const updatedData = {
        appointmentDate: firestore.Timestamp.fromDate(
          new Date(newDate.toDateString() + ' ' + newTimeSlot),
        ),
        timeSlot: newTimeSlot,
      };
      await updateAppointment(appointmentId, updatedData);
      Alert.alert(
        'Đã cập nhật cuộc hẹn!',
        `Cuộc hẹn của bạn cho ${
          appointment.serviceName
        } hiện đã được đặt vào ${newDate.toLocaleDateString()} lúc ${newTimeSlot}.`,
        [
          {
            text: 'OK',
            onPress: () => {
              loadAppointmentData();
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Cập nhật thất bại',
        'Không thể cập nhật cuộc hẹn. ' + error.message,
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAppointment = async () => {
    Alert.alert(
      'Huỷ cuộc hẹn',
      'Bạn có chắc chắn muốn huỷ cuộc hẹn này không?',
      [
        {text: 'Không', style: 'cancel'},
        {
          text: 'Có, Huỷ',
          onPress: async () => {
            try {
              await deleteAppointment(appointmentId);
              Alert.alert('Đã huỷ', 'Cuộc hẹn của bạn đã được huỷ.');
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                'Huỷ thất bại',
                'Không thể huỷ cuộc hẹn. ' + error.message,
              );
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const loadAppointmentData = async () => {
    setLoading(true);
    try {
      const appDetails = await getAppointmentById(appointmentId);
      if (appDetails) {
        setAppointment(appDetails);
        setNewDate(
          appDetails.appointmentDate?.toDate
            ? appDetails.appointmentDate.toDate()
            : new Date(),
        );
        setNewTimeSlot(appDetails.timeSlot || '');
      } else {
        Alert.alert('Không tìm thấy', 'Cuộc hẹn không còn tồn tại.', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      }
    } catch (error) {
      Alert.alert(
        'Lỗi',
        'Không thể tải lại chi tiết cuộc hẹn. ' + error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !appointment) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải chi tiết cuộc hẹn...</Text>
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cuộc hẹn không tìm thấy.</Text>
        <Button title="Quay lại" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const displayNewDate = newDate ? newDate.toLocaleDateString() : 'Chọn ngày';
  const currentAppointmentDate = appointment.appointmentDate?.toDate
    ? appointment.appointmentDate.toDate().toLocaleDateString()
    : 'N/A';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chi tiết cuộc hẹn</Text>
      <Text style={styles.detailText}>Dịch vụ: {appointment.serviceName}</Text>
      <Text style={styles.detailText}>
        Current Date: {currentAppointmentDate}
      </Text>
      <Text style={styles.detailText}>
        Thời gian hiện tại: {appointment.timeSlot}
      </Text>
      <Text style={styles.detailText}>Trạng thái: {appointment.status}</Text>
      {appointment.notes && (
        <Text style={styles.detailText}>Ghi chú: {appointment.notes}</Text>
      )}

      {appointment.status !== 'Đã huỷ' &&
        appointment.status !== 'Đã hoàn thành' && (
          <>
            <Text style={styles.updateSectionTitle}>
              Cập nhật cuộc hẹn (nếu cần):
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerButton}>
              <Text style={styles.datePickerButtonText}>
                Change Date: {displayNewDate}
              </Text>
            </TouchableOpacity>
            {Platform.OS !== 'ios' && showDatePicker && (
              <Button
                title="Hoàn tất chọn ngày"
                onPress={() => setShowDatePicker(false)}
              />
            )}

            <Text style={styles.timeSlotHeader}>
              Khung giờ mới cho {displayNewDate}:
            </Text>
            <View style={styles.timeSlotsContainer}>
              {timeSlots.map(slot => (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.timeSlotButton,
                    newTimeSlot === slot && styles.selectedTimeSlotButton,
                  ]}
                  onPress={() => setNewTimeSlot(slot)}>
                  <Text
                    style={[
                      styles.timeSlotText,
                      newTimeSlot === slot && styles.selectedTimeSlotText,
                    ]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              {isUpdating ? (
                <ActivityIndicator size="small" color="#007bff" />
              ) : (
                <Button
                  title="Cập nhật cuộc hẹn"
                  onPress={handleUpdateAppointment}
                  disabled={
                    !newTimeSlot ||
                    (newDate?.getTime() ===
                      appointment.appointmentDate?.toDate().getTime() &&
                      newTimeSlot === appointment.timeSlot) ||
                    isUpdating
                  }
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Huỷ cuộc hẹn"
                color="red"
                onPress={handleDeleteAppointment}
                disabled={isUpdating}
              />
            </View>
          </>
        )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  updateSectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 15,
  },
  datePickerButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  datePickerButtonText: {
    color: '#fff',
    fontSize: 15,
  },
  timeSlotHeader: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
    marginBottom: 5,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  timeSlotButton: {
    backgroundColor: '#e9ecef',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#adb5bd',
    margin: 4,
    minWidth: '45%',
    alignItems: 'center',
  },
  selectedTimeSlotButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  timeSlotText: {
    color: '#007bff',
    fontSize: 14,
  },
  selectedTimeSlotText: {
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default AppointmentDetailScreen;
