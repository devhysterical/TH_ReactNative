import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  getAppointmentsByUserId,
  deleteAppointment,
} from '../../../services/firestore';
import {useAuth} from '../../../context/AuthContext';
import {useFocusEffect} from '@react-navigation/native';

const MyAppointmentsScreen = ({navigation}) => {
  const {user} = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function loadAppointments() {
        if (!user?.uid) {
          Alert.alert(
            'Lỗi',
            'Không tìm thấy người dùng. Vui lòng đăng nhập lại.',
          );
          setLoading(false);
          return;
        }
        setLoading(true);
        try {
          const userAppointments = await getAppointmentsByUserId(user.uid);
          setAppointments(userAppointments);
        } catch (error) {
          Alert.alert(
            'Lỗi',
            'Không thể tải danh sách cuộc hẹn. ' + error.message,
          );
        } finally {
          setLoading(false);
        }
      }

      loadAppointments();
    }, [user?.uid]),
  );

  const onRefresh = useCallback(async () => {
    if (!user?.uid) {
      Alert.alert('Lỗi', 'Không tìm thấy người dùng. Vui lòng đăng nhập lại.');
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    try {
      const userAppointments = await getAppointmentsByUserId(user.uid);
      setAppointments(userAppointments);
    } catch (error) {
      Alert.alert(
        'Lỗi',
        'Không thể tải lại danh sách cuộc hẹn. ' + error.message,
      );
    } finally {
      setRefreshing(false);
    }
  }, [user?.uid]);

  const handleDeleteAppointment = appointmentId => {
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
              setAppointments(prev =>
                prev.filter(app => app.id !== appointmentId),
              );
              Alert.alert('Huỷ', 'Cuộc hẹn của bạn đã được huỷ.');
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể huỷ cuộc hẹn. ' + error.message);
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  const renderItem = ({item}) => {
    const dateObject = item.appointmentDate?.toDate
      ? item.appointmentDate.toDate()
      : null;
    const formattedDate = dateObject ? dateObject.toLocaleDateString() : 'N/A';

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemService}>{item.serviceName}</Text>
        <Text style={styles.itemDateTime}>
          Ngày: {formattedDate} vào lúc {item.timeSlot || 'N/A'}
        </Text>
        <Text style={styles.itemStatus}>Trạng thái: {item.status}</Text>
        <View style={styles.itemButtons}>
          <Button
            title="Chi tiết/Cập nhật"
            onPress={() =>
              navigation.navigate('CustomerAppointmentDetail', {
                appointmentId: item.id,
              })
            }
          />
          <View style={{width: 10}} />
          <Button
            title="Huỷ"
            color="red"
            onPress={() => handleDeleteAppointment(item.id)}
            disabled={
              item.status === 'Đã huỷ' || item.status === 'Đã hoàn thành'
            }
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : appointments.length > 0 ? (
        <FlatList
          data={appointments}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      ) : (
        <Text style={styles.emptyText}>Bạn không có cuộc hẹn nào.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  itemService: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDateTime: {
    fontSize: 15,
    color: '#555',
    marginVertical: 4,
  },
  itemStatus: {
    fontSize: 15,
    color: '#007bff',
    marginBottom: 10,
  },
  itemButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#6c757d',
  },
});

export default MyAppointmentsScreen;
