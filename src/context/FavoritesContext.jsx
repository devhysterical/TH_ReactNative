import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

const FAVORITES_STORAGE_KEY = '@contacts_favorites';

export const FavoritesProvider = ({children}) => {
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [allContacts, setAllContacts] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(
          FAVORITES_STORAGE_KEY,
        );
        if (storedFavorites !== null) {
          setFavoriteIds(new Set(JSON.parse(storedFavorites)));
        }
      } catch (e) {
        console.error('Failed to load favorites from storage', e);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify([...favoriteIds]),
        );
      } catch (e) {
        console.error('Failed to save favorites to storage', e);
      }
    };
    if (favoriteIds.size >= 0) {
      saveFavorites();
    }
  }, [favoriteIds]);

  const setFetchedContacts = contacts => {
    setAllContacts(contacts);
  };

  const addFavorite = contactId => {
    setFavoriteIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.add(contactId);
      return newIds;
    });
  };

  const removeFavorite = contactId => {
    setFavoriteIds(prevIds => {
      const newIds = new Set(prevIds);
      newIds.delete(contactId);
      return newIds;
    });
  };

  const isFavorite = contactId => {
    return favoriteIds.has(contactId);
  };

  const toggleFavorite = contactId => {
    if (isFavorite(contactId)) {
      removeFavorite(contactId);
    } else {
      addFavorite(contactId);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        allContacts,
        setFetchedContacts,
      }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
