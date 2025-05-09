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
} from 'react-native';
import {addService} from '../../../services/firestore';

const AddServiceScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

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
    try {
      await addService({
        name: name.trim(),
        price: priceValue,
        description: description.trim(),
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
    color: '#555',
    marginBottom: 5,
    fontWeight: '500',
  },
});

export default AddServiceScreen;
