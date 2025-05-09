import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {getUserDocument, updateUserDocument} from '../../../services/firestore';
import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from '../../../context/AuthContext';

const CustomerDetailScreen = ({route, navigation}) => {
  const {customerId} = route.params;
  const {user: adminUser} = useAuth();

  const [customerData, setCustomerData] = useState(null);
  const [fullName, setFullName] = useState('');
  const [currentRole, setCurrentRole] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCustomerDetails = useCallback(async () => {
    setLoading(true);
    try {
      const customerDoc = await getUserDocument(customerId);
      if (customerDoc) {
        setCustomerData(customerDoc);
        setFullName(customerDoc.fullName || '');
        setCurrentRole(customerDoc.role || 'customer');
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin khách hàng.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin khách hàng.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [customerId, navigation]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        await fetchCustomerDetails();
      };
      loadData();
    }, [fetchCustomerDetails]),
  );

  const handleUpdateCustomer = async () => {
    if (!fullName.trim()) {
      Alert.alert('Lỗi', 'Họ tên không được để trống.');
      return;
    }
    if (customerId === adminUser?.uid && currentRole !== 'admin') {
      Alert.alert(
        'Không thể thực hiện',
        'Bạn không thể tự thay đổi vai trò của mình thành "customer".',
      );
      setCurrentRole('admin');
      return;
    }

    setSubmitting(true);
    try {
      const dataToUpdate = {
        fullName: fullName.trim(),
        role: currentRole,
      };
      await updateUserDocument(customerId, dataToUpdate);
      Alert.alert('Thành công', 'Thông tin khách hàng đã được cập nhật.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error('Error updating customer:', error);
      Alert.alert(
        'Lỗi',
        'Không thể cập nhật thông tin khách hàng. Kiểm tra quyền Firestore.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải thông tin khách hàng...</Text>
      </View>
    );
  }

  if (!customerData) {
    return (
      <View style={styles.container}>
        <Text>Không có dữ liệu khách hàng.</Text>
      </View>
    );
  }

  const isSelf = customerId === adminUser?.uid;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}>
      <Text style={styles.header}>Chi tiết khách hàng</Text>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>ID Khách hàng:</Text>
        <Text style={styles.value}>{customerId}</Text>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>Email (Không thể thay đổi):</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          value={customerData.email || 'N/A'}
          editable={false}
        />
      </View>

      <Text style={styles.label}>Họ tên:</Text>
      <TextInput
        placeholder="Họ tên"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Vai trò:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={currentRole}
          onValueChange={itemValue => {
            if (isSelf && itemValue !== 'admin') {
              Alert.alert(
                'Không thể thực hiện',
                'Bạn không thể tự thay đổi vai trò của mình thành "customer".',
              );
            } else {
              setCurrentRole(itemValue);
            }
          }}
          style={styles.picker}
          enabled={!isSelf}>
          <Picker.Item label="Customer" value="customer" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
      </View>
      {isSelf && (
        <Text style={styles.noteText}>
          Bạn không thể thay đổi vai trò của chính mình.
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          title={submitting ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
          onPress={handleUpdateCustomer}
          disabled={submitting || loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flexGrow: 1,
    padding: 20,
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
    color: '#333',
  },
  infoGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  readOnlyInput: {
    backgroundColor: '#e9ecef',
    color: '#495057',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  buttonContainer: {
    marginTop: 10,
  },
  noteText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default CustomerDetailScreen;
