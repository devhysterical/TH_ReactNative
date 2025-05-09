import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  getServiceById,
  updateService,
  deleteService,
} from '../../../services/firestore';
import {useFocusEffect} from '@react-navigation/native';

const ServiceDetailScreen = ({route, navigation}) => {
  const {serviceId} = route.params;
  const [service, setService] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [displayPrice, setDisplayPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchServiceDetails = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedService = await getServiceById(serviceId);
      if (fetchedService) {
        setService(fetchedService);
        setName(fetchedService.name);
        setPrice(String(fetchedService.price));
        setDisplayPrice(
          fetchedService.price
            ? `${Number(fetchedService.price).toLocaleString('vi-VN')} VND`
            : '',
        );
        setDescription(fetchedService.description || '');
      } else {
        Alert.alert('Lỗi', 'Dịch vụ không được tìm thấy.');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy thông tin dịch vụ.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [serviceId, navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchServiceDetails();
    }, [fetchServiceDetails]),
  );

  const handlePriceChange = text => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setPrice(numericValue);
    if (numericValue) {
      setDisplayPrice(`${Number(numericValue).toLocaleString('vi-VN')} VND`);
    } else {
      setDisplayPrice('');
    }
  };

  const handleUpdateService = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Lỗi xác nhận', 'Tên dịch vụ và giá là bắt buộc.');
      return;
    }
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Lỗi xác nhận', 'Vui lòng nhập giá hợp lệ và dương.');
      return;
    }

    setUpdating(true);
    try {
      await updateService(serviceId, {
        name: name.trim(),
        price: priceValue,
        description: description.trim(),
      });
      Alert.alert('Thành công', 'Dịch vụ đã được cập nhật thành công!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật dịch vụ.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteService = () => {
    Alert.alert(
      'Xác nhận xoá',
      'Bạn có chắc chắn muốn xoá dịch vụ này? Hành động này không thể hoàn tác.',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Xoá',
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteService(serviceId);
              Alert.alert('Thành công', 'Dịch vụ đã được xoá thành công!');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xoá dịch vụ.');
            } finally {
              setDeleting(false);
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải thông tin dịch vụ...</Text>
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy dịch vụ.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Thông tin dịch vụ</Text>
        <TextInput
          placeholder="Tên dịch vụ"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <Text style={styles.label}>Giá (VND):</Text>
        <TextInput
          placeholder="Giá (ví dụ: 50000)"
          value={price}
          onChangeText={handlePriceChange}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Mô tả (tuỳ chọn)"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
        />
        <View style={styles.buttonRow}>
          {updating ? (
            <ActivityIndicator size="small" color="#007bff" />
          ) : (
            <Button
              title="Cập nhật dịch vụ"
              onPress={handleUpdateService}
              disabled={deleting}
            />
          )}
        </View>
        <View style={styles.deleteButtonContainer}>
          {deleting ? (
            <ActivityIndicator size="small" color="#dc3545" />
          ) : (
            <Button
              title="Xoá dich vụ"
              color="#dc3545"
              onPress={handleDeleteService}
              disabled={updating}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#343a40',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    marginTop: 10,
    marginBottom: 15,
  },
  deleteButtonContainer: {
    marginTop: 20,
  },
  label: {
    // Thêm style cho label nếu cần
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    fontWeight: '500',
  },
});

export default ServiceDetailScreen;
