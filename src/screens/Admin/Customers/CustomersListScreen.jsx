import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import {getUsersByRole} from '../../../services/firestore';
import {useFocusEffect} from '@react-navigation/native';

const CustomersListScreen = ({navigation}) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const customerUsers = await getUsersByRole('customer');
      setCustomers(customerUsers);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy dữ liệu khách hàng.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCustomers();
    }, []),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(false);
    fetchCustomers();
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.fullName || 'N/A'}</Text>
        <Text style={styles.itemEmail}>{item.email}</Text>
      </View>
      <Button
        title="Chi tiết/Cập nhật"
        onPress={() =>
          navigation.navigate('CustomerDetail', {
            customerId: item.id,
            customerData: item,
          })
        }
      />
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Tải dữ liệu khách hàng...</Text>
      </View>
    );
  }

  if (!customers.length && !loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Quản lý khách hàng</Text>
        <Text style={styles.emptyText}>Không tìm thấy khách hàng.</Text>
        <Button title="Refresh" onPress={fetchCustomers} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quản lý khách hàng</Text>
      <FlatList
        data={customers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemEmail: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#555',
  },
});

export default CustomersListScreen;
