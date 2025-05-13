import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {getUsersByRole} from '../../../services/firestore';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const AdminsListScreen = ({navigation}) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const adminUsers = await getUsersByRole('admin');
      setAdmins(adminUsers);
    } catch (error) {
      console.error('Error fetching admins:', error);
      Alert.alert('Lỗi', 'Không thể lấy dữ liệu quản trị viên.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAdmins();
    }, [fetchAdmins]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAdmins();
  }, [fetchAdmins]);

  const renderAdminItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate('CustomerDetail', {customerId: item.id})
      }>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.fullName || 'N/A'}</Text>
        <Text style={styles.itemEmail}>{item.email}</Text>
      </View>
      <Icon name="chevron-forward-outline" size={22} color="#ccc" />
    </TouchableOpacity>
  );

  if (loading && !refreshing && admins.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải danh sách quản trị viên...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách Quản trị viên</Text>
      {admins.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Không tìm thấy quản trị viên nào.
          </Text>
        </View>
      ) : (
        <FlatList
          data={admins}
          renderItem={renderAdminItem}
          keyExtractor={item => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007bff']}
              tintColor={'#007bff'}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#343a40',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
  },
  itemEmail: {
    fontSize: 14,
    color: '#777',
    marginTop: 3,
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default AdminsListScreen;
