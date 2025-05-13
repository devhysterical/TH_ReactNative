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
  Image,
  TouchableOpacity,
} from 'react-native';
import {getServices} from '../../../services/firestore';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomerServicesListScreen = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allServices, setAllServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllServices = useCallback(async () => {
    try {
      const servicesFromDB = await getServices();
      setAllServices(servicesFromDB);
      setFilteredServices(servicesFromDB);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy dịch vụ. ' + error.message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        await fetchAllServices();
        setLoading(false);
      };
      loadData();
    }, [fetchAllServices]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllServices();
    setRefreshing(false);
  }, [fetchAllServices]);

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
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate('CustomerServiceDetail', {serviceId: item.id})
      }>
      {item.imageBase64 ? (
        <Image
          source={{uri: `data:image/jpeg;base64,${item.imageBase64}`}}
          style={styles.serviceImage}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Icon name="image-off-outline" size={40} color="#ccc" />
        </View>
      )}
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
    </TouchableOpacity>
  );

  if (loading && !refreshing && filteredServices.length === 0) {
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
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'Không tìm thấy dịch vụ nào phù hợp với tìm kiếm của bạn.'
              : 'Hiện tại không có dịch vụ nào.'}
          </Text>
        </View>
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
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    color: '#007bff',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: '#555',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6c757d',
    marginTop: 20,
  },
});

export default CustomerServicesListScreen;
