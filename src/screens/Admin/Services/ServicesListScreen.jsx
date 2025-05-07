import React, {useState, useCallback} from 'react';
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
import {getServices} from '../../../services/firestore';
import {useFocusEffect} from '@react-navigation/native';

const ServicesListScreen = ({navigation}) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const fetchedServices = await getServices();
      setServices(fetchedServices);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy dịch vụ.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchServices();
    }, []),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchServices();
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
        {item.description && (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
      <Button
        title="Thông tin"
        onPress={() =>
          navigation.navigate('ServiceDetail', {serviceId: item.id})
        }
      />
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải dịch vụ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Quản lý dịch vụ</Text>
        <Button
          title="Thêm dịch vụ mới"
          onPress={() => navigation.navigate('AddService')}
        />
      </View>
      {services.length === 0 && !loading ? (
        <Text style={styles.emptyText}>
          Không tìm thấy dịch vụ nào. Thêm một cái!
        </Text>
      ) : (
        <FlatList
          data={services}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
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
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#343a40',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#495057',
  },
  itemPrice: {
    fontSize: 16,
    color: '#28a745',
    marginTop: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  list: {
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 30,
    color: '#6c757d',
  },
});

export default ServicesListScreen;
