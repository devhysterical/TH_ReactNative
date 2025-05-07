import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {getServiceById} from '../../../services/firestore';
import {useFocusEffect} from '@react-navigation/native';

const CustomerServiceDetailScreen = ({route, navigation}) => {
  const {serviceId} = route.params;
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadServiceDetails() {
        setLoading(true);
        try {
          const details = await getServiceById(serviceId);
          if (details) {
            setServiceDetails(details);
          } else {
            Alert.alert('Không tìm thấy', 'Không tìm thấy chi tiết dịch vụ.', [
              {text: 'OK', onPress: () => navigation.goBack()},
            ]);
          }
        } catch (error) {
          Alert.alert(
            'Lỗi',
            'Không thể lấy chi tiết dịch vụ. ' + error.message,
            [{text: 'OK', onPress: () => navigation.goBack()}],
          );
        } finally {
          setLoading(false);
        }
      }

      loadServiceDetails();
    }, [serviceId, navigation]),
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!serviceDetails) {
    return (
      <View style={styles.container}>
        <Text>Dịch vụ không tìm thấy.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{serviceDetails.name}</Text>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Giá:</Text>
        <Text style={styles.value}>
          ${serviceDetails.price ? serviceDetails.price.toFixed(2) : 'N/A'}
        </Text>
      </View>
      {serviceDetails.duration && (
        <View style={styles.detailItem}>
          <Text style={styles.label}>Thời gian:</Text>
          <Text style={styles.value}>{serviceDetails.duration}</Text>
        </View>
      )}
      {serviceDetails.availability && (
        <View style={styles.detailItem}>
          <Text style={styles.label}>Tình trạng:</Text>
          <Text style={styles.value}>{serviceDetails.availability}</Text>
        </View>
      )}
      <Text style={styles.descriptionLabel}>Mô tả:</Text>
      <Text style={styles.descriptionText}>
        {serviceDetails.description || 'Không có mô tả nào.'}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Đặt lịch hẹn"
          onPress={() =>
            navigation.navigate('MakeAppointment', {
              serviceId: serviceDetails.id,
              serviceName: serviceDetails.name,
              servicePrice: serviceDetails.price,
            })
          }
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 17,
    fontWeight: '500',
    color: '#555',
    marginRight: 8,
    width: 100,
  },
  value: {
    fontSize: 17,
    color: '#333',
    flex: 1,
  },
  descriptionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#444',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 25,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default CustomerServiceDetailScreen;
