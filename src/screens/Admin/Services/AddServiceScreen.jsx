import React, {useState} from 'react';
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
import {addService} from '../../../services/firestore';
import {launchImageLibrary} from 'react-native-image-picker';
import {uploadImageAndGetDownloadURL} from '../../../services/storageService';
import Icon from 'react-native-vector-icons/Ionicons';

const AddServiceScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [imagePath, setImagePath] = useState(null);

  const handleChoosePhoto = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Lỗi', 'Không thể chọn ảnh: ' + response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
        setImagePath(response.assets[0].uri);
      }
    });
  };

  const handleSaveService = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Lỗi xác nhận', 'Tên dịch vụ và giá không được để trống.');
      return;
    }
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Lỗi xác nhận', 'Vui lòng nhập giá hợp lệ và dương.');
      return;
    }

    setLoading(true);
    let serviceImageUrl = null;
    try {
      if (imagePath) {
        const fileName = `service_${Date.now()}_${imagePath.substring(
          imagePath.lastIndexOf('/') + 1,
        )}`;
        const storagePath = `services_images/${fileName}`;
        serviceImageUrl = await uploadImageAndGetDownloadURL(
          imagePath,
          storagePath,
        );
      }

      await addService({
        name: name.trim(),
        price: priceValue,
        description: description.trim(),
        imageUrl: serviceImageUrl,
      });
      Alert.alert('Thành công', 'Dịch vụ đã được thêm thành công!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm dịch vụ. Vui lòng thử lại.');
      console.error('Lỗi thêm dịch vụ:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Thêm dịch vụ mới</Text>
        <TextInput
          placeholder="Tên dịch vụ (ví dụ: Chăm sóc da)"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <Text style={styles.label}>Giá (VND):</Text>
        <TextInput
          placeholder="Giá (ví dụ: 50000)"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Mô tả (Tùy chọn)"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={handleChoosePhoto}>
          <Icon name="image-outline" size={22} color="#007bff" />
          <Text style={styles.imagePickerText}>Chọn ảnh cho dịch vụ</Text>
        </TouchableOpacity>

        {imageUri && (
          <Image source={{uri: imageUri}} style={styles.previewImage} />
        )}

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#007bff"
            style={styles.loader}
          />
        ) : (
          <Button title="Lưu dịch vụ" onPress={handleSaveService} />
        )}
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
  loader: {
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
    marginBottom: 15,
    resizeMode: 'cover',
  },
});

export default AddServiceScreen;
