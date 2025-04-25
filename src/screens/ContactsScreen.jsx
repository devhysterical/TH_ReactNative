import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useFavorites} from '../context/FavoritesContext';

const RESULTS_PER_PAGE = 20;
const BASE_API_URL = `https://randomuser.me/api/?seed=fullstackio&results=${RESULTS_PER_PAGE}`;

const ContactsScreen = ({navigation}) => {
  const [contacts, setContacts] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const {isFavorite, toggleFavorite, setFetchedContacts, favoriteIds} =
    useFavorites();

  const fetchContactsData = useCallback(
    async (page = 1) => {
      if (page === 1) {
        setLoadingInitial(true);
      } else {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
      }
      setError(null);

      try {
        const response = await fetch(`${BASE_API_URL}&page=${page}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const fetchedContacts = data.results || [];

        if (fetchedContacts.length === 0) {
          setHasMore(false);
        } else {
          setContacts(prevContacts =>
            page === 1
              ? fetchedContacts
              : [...prevContacts, ...fetchedContacts],
          );

          setFetchedContacts(prevAllContacts =>
            page === 1
              ? fetchedContacts
              : [...prevAllContacts, ...fetchedContacts],
          );
          setCurrentPage(page);
        }
      } catch (e) {
        console.error('Failed to fetch contacts:', e);
        setError('Failed to load contacts. Please try again.');
      } finally {
        if (page === 1) {
          setLoadingInitial(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [loadingMore, hasMore, setFetchedContacts],
  );

  useEffect(() => {
    fetchContactsData(1);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchContactsData(currentPage + 1);
    }
  };

  const renderItem = ({item}) => {
    const contactId = item.login.uuid;
    const favorite = isFavorite(contactId);

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.infoTouchable}
          onPress={() => navigation.navigate('Profile', {contact: item})}>
          <Image source={{uri: item.picture.thumbnail}} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>
              {`${item.name.first} ${item.name.last}`}
            </Text>
            <Text style={styles.emailText}>{item.email}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleFavorite(contactId)}
          style={styles.favoriteButton}>
          <Icon
            name="star"
            size={24}
            color={favorite ? 'gold' : 'lightgray'}
            solid={favorite}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  if (loadingInitial && contacts.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading contacts...</Text>
      </View>
    );
  }

  if (error && contacts.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={() => fetchContactsData(1)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <Text style={styles.inlineErrorText}>{error}</Text>}
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={item => item.login.uuid}
        style={styles.listOnly}
        extraData={Array.from(favoriteIds)}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listOnly: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 14,
    color: 'gray',
  },
  favoriteButton: {
    padding: 10,
    marginLeft: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  inlineErrorText: {
    color: 'red',
    textAlign: 'center',
    paddingVertical: 5,
    backgroundColor: '#ffe0e0',
  },
  loadingFooter: {
    paddingVertical: 20,
  },
});

export default ContactsScreen;
