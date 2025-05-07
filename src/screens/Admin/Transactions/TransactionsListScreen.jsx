import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getAllAppointments} from '../../../services/firestore';

const TransactionsListScreen = ({navigation}) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointmentsData = async () => {
    try {
      setLoading(true);
      const apps = await getAllAppointments();
      setAppointments(apps);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy thông tin cuộc hẹn: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAppointmentsData();
    }, []),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointmentsData().finally(() => setRefreshing(false));
  }, []);

  const renderAppointmentItem = ({item}) => {
    const appointmentDate = item.appointmentDate?.toDate
      ? item.appointmentDate.toDate()
      : null;
    const formattedDate = appointmentDate
      ? appointmentDate.toLocaleDateString()
      : 'N/A';
    const formattedTime = item.timeSlot || 'N/A';

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          navigation.navigate('TransactionDetail', {
            appointmentId: item.id,
          })
        }>
        <Text style={styles.itemTitle}>
          Dịch vụ: {item.serviceName || 'Dịch vụ không xác định'}
        </Text>
        <Text style={styles.itemDetail}>ID khách hàng: {item.userId}</Text>
        <Text style={styles.itemDetail}>
          Ngày: {formattedDate} lúc {formattedTime}
        </Text>
        <Text style={styles.itemDetail}>Giá: ${item.servicePrice || 0}</Text>
        <Text
          style={[
            styles.itemStatus,
            item.status === 'Đã hoàn thành' && styles.statusCompleted,
            item.status === 'Đã hủy' && styles.statusCancelled,
            item.status === 'Đang chờ' && styles.statusPending,
            item.status === 'Đã xác nhận' && styles.statusConfirmed,
          ]}>
          Trạng thái: {item.status || 'N/A'}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing && appointments.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {appointments.length === 0 && !loading ? (
        <Text style={styles.emptyText}>Không tìm thấy cuộc hẹn nào.</Text>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDetail: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  itemStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statusPending: {
    color: '#ffa500',
  },
  statusConfirmed: {
    color: '#17a2b8',
  },
  statusCompleted: {
    color: '#28a745',
  },
  statusCancelled: {
    color: '#dc3545',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default TransactionsListScreen;
