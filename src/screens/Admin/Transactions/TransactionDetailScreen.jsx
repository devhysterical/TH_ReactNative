import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  getAppointmentById,
  updateAppointment,
} from '../../../services/firestore';

const TransactionDetailScreen = ({route, navigation}) => {
  const {appointmentId} = route.params;
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const possibleStatuses = [
    'Chờ xác nhận',
    'Đã xác nhận',
    'Đã hoàn thành',
    'Đã hủy',
  ];

  const fetchAppointmentDetails = useCallback(async () => {
    try {
      setLoading(true);
      const app = await getAppointmentById(appointmentId);
      if (app) {
        setAppointment(app);
        setNewStatus(app.status || 'Chờ xác nhận');
        navigation.setOptions({title: `Appt: ${app.serviceName}`});
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy cuộc hẹn.');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy thông tin cuộc hẹn: ' + error.message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [appointmentId, navigation]);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [fetchAppointmentDetails]);

  const handleUpdateStatus = async () => {
    if (!newStatus || (appointment && newStatus === appointment.status)) {
      Alert.alert(
        'Không có thay đổi',
        'Vui lòng chọn trạng thái mới để cập nhật.',
      );
      return;
    }
    setIsUpdating(true);
    try {
      await updateAppointment(appointmentId, {status: newStatus});
      setAppointment(prev => ({...prev, status: newStatus}));
      Alert.alert(
        'Thành công',
        'Trạng thái cuộc hẹn đã được cập nhật thành công.',
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles.container}>
        <Text>Thông tin cuộc hẹn không tìm thấy.</Text>
      </View>
    );
  }

  const appointmentDate = appointment.appointmentDate?.toDate
    ? appointment.appointmentDate.toDate()
    : null;
  const formattedDate = appointmentDate
    ? appointmentDate.toLocaleDateString()
    : 'N/A';
  const formattedTime = appointment.timeSlot || 'N/A';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Dịch vụ: {appointment.serviceName || 'Dich vụ không xác định'}
      </Text>
      <View style={styles.detailItem}>
        <Text style={styles.label}>ID khách hàng:</Text>
        <Text style={styles.value}>{appointment.userId}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Ngày và Giờ:</Text>
        <Text style={styles.value}>
          {formattedDate} at {formattedTime}
        </Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Giá:</Text>
        <Text style={styles.value}>${appointment.servicePrice || 0}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Trạng thái gần đây:</Text>
        <Text style={styles.value}>{appointment.status}</Text>
      </View>

      <View style={styles.updateSection}>
        <Text style={styles.label}>Cập nhật trạng thái:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={newStatus}
            style={styles.picker}
            onValueChange={itemValue => setNewStatus(itemValue)}>
            {possibleStatuses.map(status => (
              <Picker.Item key={status} label={status} value={status} />
            ))}
          </Picker>
        </View>
        <Button
          title="Lưu cập nhật trạng thái"
          onPress={handleUpdateStatus}
          disabled={
            isUpdating || (appointment && newStatus === appointment.status)
          }
        />
        {isUpdating && <ActivityIndicator style={{marginTop: 10}} />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
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
    color: '#333',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  updateSection: {
    marginTop: 25,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default TransactionDetailScreen;
