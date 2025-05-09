import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import {getServices} from '../../../services/firestore';
import {useFocusEffect} from '@react-navigation/native';

const CustomerServicesListScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchDataOnFocus() {
        setLoading(true);
        try {
          const servicesFromDB = await getServices();
          setAllServices(servicesFromDB);
          setFilteredServices(servicesFromDB);
        } catch (error) {
          Alert.alert('Lỗi', 'Không thể lấy dịch vụ. ' + error.message);
        } finally {
          setLoading(false);
        }
      }

      fetchDataOnFocus();
    }, []),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const servicesFromDB = await getServices();
      setAllServices(servicesFromDB);
      setFilteredServices(servicesFromDB);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể làm mới dịch vụ. ' + error.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleSearch = query => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredServices(allServices);
    } else {
      const filtered = allServices.filter(service =>
        service.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredServices(filtered);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>
          {item.price
            ? `${Number(item.price).toLocaleString('vi-VN')} VND`
            : 'N/A'}
        </Text>
        {item.description && (
          <Text style={styles.itemDescription} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>
      <Button
        title="Chi tiết"
        onPress={() =>
          navigation.navigate('CustomerServiceDetail', {serviceId: item.id})
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
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm dịch vụ theo tên..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {filteredServices.length > 0 ? (
        <FlatList
          data={filteredServices}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text style={styles.emptyText}>
          {searchQuery
            ? 'Không tìm thấy dịch vụ nào phù hợp với tìm kiếm của bạn.'
            : 'Hiện tại không có dịch vụ nào.'}
        </Text>
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
  searchInput: {
    height: 45,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 17,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 15,
    color: '#28a745',
    marginTop: 3,
  },
  itemDescription: {
    fontSize: 13,
    color: '#6c757d',
    marginTop: 3,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6c757d',
  },
});

export default CustomerServicesListScreen;
