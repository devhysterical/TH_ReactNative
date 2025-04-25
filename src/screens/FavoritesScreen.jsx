import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useFavorites} from '../context/FavoritesContext';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';

const FavoritesScreen = () => {
  const {favoriteIds, allContacts, isFavorite, toggleFavorite} = useFavorites();
  const navigation = useNavigation();
  const favoriteContacts = allContacts.filter(contact =>
    favoriteIds.has(contact.login.uuid),
  );

  const renderItem = ({item}) => {
    const contactId = item.login.uuid;

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
            color={'gold'}
            solid={true}
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (favoriteContacts.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Bạn chưa có dữ liệu yêu thích.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favoriteContacts}
      renderItem={renderItem}
      keyExtractor={item => item.login.uuid}
      style={styles.list}
      extraData={Array.from(favoriteIds)}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#fff',
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
});

export default FavoritesScreen;
