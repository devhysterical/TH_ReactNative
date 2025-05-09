import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {getServices} from '../../../services/firestore';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const ServicesListScreen = ({navigation}) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchServices = async () => {
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
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate('ServiceDetail', {serviceId: item.id})
      }>
      <Text style={styles.itemName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.itemPrice}>
        {item.price
          ? `${Number(item.price).toLocaleString('vi-VN')} VND`
          : 'N/A'}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing && services.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải dịch vụ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../../assets/images/spa-center.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Danh sách dịch vụ</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddService')}>
          <Icon name="add-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {services.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy dịch vụ nào.</Text>
          <Text style={styles.emptySubText}>
            Nhấn nút{' '}
            <Icon name="add-circle-outline" size={18} color="#007bff" /> để thêm
            dịch vụ mới.
          </Text>
        </View>
      ) : (
        <FlatList
          data={services}
          renderItem={renderItem}
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
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  logo: {
    width: 250,
    height: 100,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
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
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007bff',
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 20,
    paddingTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 10,
  },
  emptySubText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
  },
});

export default ServicesListScreen;
