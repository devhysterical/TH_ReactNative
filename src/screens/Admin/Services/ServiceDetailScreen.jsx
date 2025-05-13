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
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  getServiceById,
  updateService,
  deleteService,
} from '../../../services/firestore';
import {useFocusEffect} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const ServiceDetailScreen = ({route, navigation}) => {
  const {serviceId} = route.params;
  const [service, setService] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [initialImageBase64, setInitialImageBase64] = useState(null);
  const [newImageUri, setNewImageUri] = useState(null);
  const [newImageBase64, setNewImageBase64] = useState(null);
  const [clearCurrentImage, setClearCurrentImage] = useState(false);

  const fetchServiceDetails = useCallback(async () => {
    setLoading(true);
    setNewImageUri(null);
    setNewImageBase64(null);
    setClearCurrentImage(false);
    try {
      const fetchedService = await getServiceById(serviceId);
      if (fetchedService) {
        setService(fetchedService);
        setName(fetchedService.name);
        setPrice(String(fetchedService.price));
        setDescription(fetchedService.description || '');
        setInitialImageBase64(fetchedService.imageBase64 || null);
      } else {
        Alert.alert('Lỗi', 'Dịch vụ không được tìm thấy.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Lỗi fetchServiceDetails: ', error);
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

  const handleChoosePhoto = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 800,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Lỗi', 'Không thể chọn ảnh: ' + response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          if (asset.base64) {
            const base64StringSizeInBytes =
              asset.base64.length * (3 / 4) -
              (asset.base64.endsWith('==')
                ? 2
                : asset.base64.endsWith('=')
                ? 1
                : 0);
            const sizeLimitBytes = 700 * 1024;
            if (base64StringSizeInBytes > sizeLimitBytes) {
              Alert.alert(
                'Lỗi kích thước',
                `Ảnh quá lớn (khoảng ${Math.round(
                  base64StringSizeInBytes / 1024,
                )}KB). Vui lòng chọn ảnh nhỏ hơn ${Math.round(
                  sizeLimitBytes / 1024,
                )}KB.`,
              );
              return;
            }
            setNewImageUri(asset.uri);
            setNewImageBase64(asset.base64);
            setClearCurrentImage(false);
          } else {
            Alert.alert('Lỗi', 'Không thể lấy dữ liệu Base64 từ ảnh.');
          }
        }
      },
    );
  };

  const handlePriceChange = text => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setPrice(numericValue);
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
      const dataToUpdate = {
        name: name.trim(),
        price: priceValue,
        description: description.trim(),
      };

      if (newImageBase64) {
        dataToUpdate.imageBase64 = newImageBase64;
      } else if (clearCurrentImage) {
        dataToUpdate.imageBase64 = null;
      }

      console.log('Dữ liệu gửi đi để cập nhật:', dataToUpdate);

      await updateService(serviceId, dataToUpdate);

      Alert.alert('Thành công', 'Dịch vụ đã được cập nhật thành công!');
      fetchServiceDetails();
    } catch (error) {
      console.error('LỖI CỤ THỂ KHI CẬP NHẬT DỊCH VỤ (Màn hình):', error);
      Alert.alert(
        'Lỗi cập nhật',
        `Không thể cập nhật dịch vụ. ${error.message || 'Vui lòng thử lại.'}`,
      );
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
              console.error('Lỗi xóa dịch vụ: ', error);
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

        {newImageUri ? (
          <Image source={{uri: newImageUri}} style={styles.previewImage} />
        ) : initialImageBase64 ? (
          <Image
            source={{uri: `data:image/jpeg;base64,${initialImageBase64}`}}
            style={styles.previewImage}
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Icon name="image-off-outline" size={50} color="#ccc" />
            <Text style={styles.noImageText}>Chưa có ảnh</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={handleChoosePhoto}>
          <Icon name="camera-outline" size={22} color="#007bff" />
          <Text style={styles.imagePickerText}>
            {newImageUri || initialImageBase64 ? 'Thay đổi ảnh' : 'Chọn ảnh'}
          </Text>
        </TouchableOpacity>

        {(newImageUri || initialImageBase64) && !clearCurrentImage && (
          <TouchableOpacity
            style={[styles.imagePickerButton, {backgroundColor: '#ffdddd'}]}
            onPress={() => {
              setNewImageUri(null);
              setNewImageBase64(null);
              setClearCurrentImage(true);
            }}>
            <Icon name="trash-outline" size={22} color="#dc3545" />
            <Text style={[styles.imagePickerText, {color: '#dc3545'}]}>
              Xóa ảnh hiện tại
            </Text>
          </TouchableOpacity>
        )}
        {clearCurrentImage && (
          <Text style={{textAlign: 'center', color: 'red', marginBottom: 10}}>
            Ảnh sẽ bị xóa khi cập nhật.
          </Text>
        )}

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
    fontSize: 16,
    color: '#495057',
    marginBottom: 5,
    fontWeight: '500',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    justifyContent: 'center',
  },
  imagePickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#007bff',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  noImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    marginTop: 10,
    color: '#aaa',
    fontSize: 16,
  },
});

export default ServiceDetailScreen;
