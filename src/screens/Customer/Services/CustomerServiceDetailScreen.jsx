import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {
  getServiceById,
  addReview,
  getReviewsByServiceId,
  getUserReviewForService,
} from '../../../services/firestore';
import {useAuth} from '../../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomerServiceDetailScreen = ({route, navigation}) => {
  const {serviceId} = route.params;
  const {user} = useAuth();
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [existingUserReview, setExistingUserReview] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [serviceImageBase64, setServiceImageBase64] = useState(null);

  const fetchServiceAndReviews = useCallback(async () => {
    try {
      setLoading(true);
      const details = await getServiceById(serviceId);
      if (details) {
        setServiceDetails(details);
        setServiceImageBase64(details.imageBase64 || null);
        navigation.setOptions({title: details.name || 'Chi tiết Dịch vụ'});

        const fetchedReviews = await getReviewsByServiceId(serviceId);
        setReviews(fetchedReviews);

        if (user) {
          const review = await getUserReviewForService(user.uid, serviceId);
          setExistingUserReview(review);
        }
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy chi tiết dịch vụ.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Lỗi fetchServiceAndReviews (Customer): ', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu dịch vụ hoặc đánh giá.');
    } finally {
      setLoading(false);
    }
  }, [serviceId, navigation, user]);

  useFocusEffect(
    useCallback(() => {
      fetchServiceAndReviews();
    }, [fetchServiceAndReviews]),
  );

  const handleStarPress = rating => {
    setUserRating(rating);
  };

  const handleSubmitReview = async () => {
    if (userRating === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn số sao đánh giá.');
      return;
    }
    if (!userComment.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập bình luận của bạn.');
      return;
    }
    if (!user || !serviceDetails) return;

    setIsSubmittingReview(true);
    try {
      await addReview({
        userId: user.uid,
        userName: user.fullName || user.email,
        userEmail: user.email,
        serviceId: serviceId,
        serviceName: serviceDetails.name,
        rating: userRating,
        comment: userComment.trim(),
      });
      Alert.alert('Thành công', 'Cảm ơn bạn đã gửi đánh giá!');
      setUserRating(0);
      setUserComment('');
      const loadReviews = async () => {
        setLoadingReviews(true);
        const fetchedReviews = await getReviewsByServiceId(serviceId);
        setReviews(fetchedReviews);
        const review = await getUserReviewForService(user.uid, serviceId);
        setExistingUserReview(review);
        setLoadingReviews(false);
      };
      loadReviews();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const renderStar = (index, forDisplay = false, ratingToDisplay = 0) => {
    const currentRating = forDisplay ? ratingToDisplay : userRating;
    return (
      <TouchableOpacity
        key={index}
        onPress={() => !forDisplay && handleStarPress(index)}
        disabled={forDisplay}>
        <Icon
          name={index <= currentRating ? 'star' : 'star-outline'}
          size={forDisplay ? 18 : 30}
          color={
            forDisplay ? '#FFD700' : index <= currentRating ? '#FFD700' : '#ccc'
          }
          style={styles.star}
        />
      </TouchableOpacity>
    );
  };

  const renderReviewItem = ({item}) => (
    <View style={styles.reviewItemContainer}>
      <Text style={styles.reviewUserName}>{item.userName || 'Ẩn danh'}</Text>
      <View style={styles.starRatingContainer}>
        {[1, 2, 3, 4, 5].map(star => renderStar(star, true, item.rating))}
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
      <Text style={styles.reviewDate}>
        {item.createdAt?.toDate
          ? item.createdAt.toDate().toLocaleDateString('vi-VN')
          : 'Gần đây'}
      </Text>
    </View>
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
        <Text>Không tìm thấy thông tin dịch vụ.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {serviceImageBase64 ? (
        <Image
          source={{uri: `data:image/jpeg;base64,${serviceImageBase64}`}}
          style={styles.serviceImageDetail}
        />
      ) : (
        <View style={styles.imagePlaceholderDetail}>
          <Icon name="image-off-outline" size={60} color="#ccc" />
          <Text style={styles.noImageTextDetail}>
            Chưa có ảnh cho dịch vụ này
          </Text>
        </View>
      )}
      <Text style={styles.title}>{serviceDetails.name}</Text>
      <View style={styles.detailItem}>
        <Text style={styles.label}>Giá:</Text>
        <Text style={styles.value}>
          {serviceDetails.price
            ? `${Number(serviceDetails.price).toLocaleString('vi-VN')} VND`
            : 'N/A'}
        </Text>
      </View>
      {serviceDetails.description && (
        <View style={styles.detailItem}>
          <Text style={styles.label}>Mô tả:</Text>
          <Text style={styles.value}>{serviceDetails.description}</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button
          title="Đặt lịch hẹn"
          onPress={() =>
            navigation.navigate('MakeAppointment', {
              serviceId: serviceId,
              serviceName: serviceDetails.name,
              servicePrice: serviceDetails.price,
            })
          }
        />
      </View>

      <View style={styles.reviewsSection}>
        <Text style={styles.sectionTitle}>Đánh giá dịch vụ</Text>
        {user && !existingUserReview && (
          <View style={styles.addReviewContainer}>
            <Text style={styles.addReviewTitle}>Để lại đánh giá của bạn:</Text>
            <View style={styles.starRatingContainer}>
              {[1, 2, 3, 4, 5].map(star => renderStar(star))}
            </View>
            <TextInput
              style={styles.reviewInput}
              placeholder="Viết bình luận của bạn..."
              value={userComment}
              onChangeText={setUserComment}
              multiline
            />
            <Button
              title={isSubmittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
              onPress={handleSubmitReview}
              disabled={isSubmittingReview}
            />
          </View>
        )}
        {user && existingUserReview && (
          <View style={styles.existingReviewMessage}>
            <Text>Bạn đã đánh giá dịch vụ này.</Text>
          </View>
        )}
        {!user && (
          <View style={styles.existingReviewMessage}>
            <Text>
              Vui lòng{' '}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate('Auth', {screen: 'Login'})}>
                đăng nhập
              </Text>{' '}
              để để lại đánh giá.
            </Text>
          </View>
        )}

        {loadingReviews ? (
          <ActivityIndicator
            size="small"
            color="#007bff"
            style={{marginTop: 10}}
          />
        ) : reviews.length > 0 ? (
          <FlatList
            data={reviews}
            renderItem={renderReviewItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noReviewsText}>
            Chưa có đánh giá nào cho dịch vụ này.
          </Text>
        )}
      </View>
    </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  detailItem: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 3,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  reviewsSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  addReviewContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addReviewTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  starRatingContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  star: {
    marginHorizontal: 3,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 10,
    fontSize: 15,
  },
  existingReviewMessage: {
    padding: 10,
    backgroundColor: '#e9f5ff',
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  loginLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  reviewItemContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewUserName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#444',
  },
  reviewComment: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    textAlign: 'right',
  },
  noReviewsText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 10,
    fontStyle: 'italic',
  },
  serviceImageDetail: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  imagePlaceholderDetail: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageTextDetail: {
    marginTop: 10,
    color: '#aaa',
    fontSize: 16,
  },
});

export default CustomerServiceDetailScreen;
