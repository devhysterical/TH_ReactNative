import React, {useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useFavorites} from '../context/FavoritesContext';

const ProfileScreen = ({route, navigation}) => {
  const {contact} = route.params || {};
  const {isFavorite, toggleFavorite} = useFavorites();

  useLayoutEffect(() => {
    if (!contact) return;

    const contactId = contact.login.uuid;
    const favorite = isFavorite(contactId);

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => toggleFavorite(contactId)}
          style={{marginRight: 15}}>
          <Icon
            name="star"
            size={24}
            color={favorite ? 'gold' : 'lightgray'}
            solid={favorite}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, contact, isFavorite, toggleFavorite]);

  if (!contact) {
    return (
      <View style={styles.container}>
        <Text>Không có dữ liệu liên hệ.</Text>
      </View>
    );
  }

  const renderInfo = (label, value) => {
    if (!value) return null;
    return (
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}:</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image source={{uri: contact.picture.large}} style={styles.avatar} />
      <Text style={styles.name}>
        {`${contact.name.title} ${contact.name.first} ${contact.name.last}`}
      </Text>

      {renderInfo('Email', contact.email)}
      {renderInfo('Phone', contact.phone)}
      {renderInfo('Cell', contact.cell)}
      {renderInfo('Gender', contact.gender)}
      {renderInfo('Nationality', contact.nat)}
      {renderInfo('Username', contact.login.username)}
      {renderInfo('UUID', contact.login.uuid)}

      {contact.location && (
        <View style={styles.locationContainer}>
          <Text style={styles.sectionTitle}>Location</Text>
          {renderInfo(
            'Street',
            `${contact.location.street.number} ${contact.location.street.name}`,
          )}
          {renderInfo('City', contact.location.city)}
          {renderInfo('State', contact.location.state)}
          {renderInfo('Country', contact.location.country)}
          {renderInfo('Postcode', contact.location.postcode)}
        </View>
      )}

      {contact.dob && (
        <View style={styles.locationContainer}>
          <Text style={styles.sectionTitle}>Date of Birth</Text>
          {renderInfo('Date', new Date(contact.dob.date).toLocaleDateString())}
          {renderInfo('Age', contact.dob.age)}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    width: '100%',
  },
  infoLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    width: 100,
    textAlign: 'right',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
  },
  locationContainer: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

export default ProfileScreen;
