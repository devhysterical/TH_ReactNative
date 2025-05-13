import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {getAllReviews} from '../../../services/firestore';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const AdminReviewsListScreen = ({navigation}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          const reviewList = await getAllReviews();
          setReviews(reviewList);
        } catch (error) {
          console.error('Error fetching reviews for admin:', error);
          Alert.alert('Lỗi', 'Không thể lấy dữ liệu đánh giá.');
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }, []),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const reviewList = await getAllReviews();
      setReviews(reviewList);
    } catch (error) {
      console.error('Error refreshing reviews for admin:', error);
      Alert.alert('Lỗi', 'Không thể làm mới dữ liệu đánh giá.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderStarDisplay = rating => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700"
          style={styles.starIcon}
        />,
      );
    }
    return <View style={styles.starRatingDisplayContainer}>{stars}</View>;
  };

  const renderReviewItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemServiceName}>
        Dịch vụ: {item.serviceName || 'N/A'}
      </Text>
      <Text style={styles.itemUserName}>
        Người đánh giá: {item.userName || item.userEmail}
      </Text>
      {renderStarDisplay(item.rating)}
      <Text style={styles.itemComment}>Bình luận: {item.comment}</Text>
      <Text style={styles.itemDate}>
        Ngày:{' '}
        {item.createdAt?.toDate
          ? item.createdAt.toDate().toLocaleDateString('vi-VN')
          : 'N/A'}
      </Text>
    </View>
  );

  if (loading && !refreshing && reviews.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải danh sách đánh giá...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tất cả Đánh giá</Text>
      {reviews.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chưa có đánh giá nào được gửi.</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
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
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#343a40',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  itemContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 1,
  },
  itemServiceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 4,
  },
  itemUserName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  starRatingDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  starIcon: {
    marginRight: 2,
  },
  itemComment: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  itemDate: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default AdminReviewsListScreen;
