import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome6';

import ContactsScreen from './src/screens/ContactsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import NearbyScreen from './src/screens/NearbyScreen';
import {FavoritesProvider} from './src/context/FavoritesContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ContactsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ContactsList"
        component={ContactsScreen}
        options={{title: 'Contacts'}}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const FavoritesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FavoritesList"
        component={FavoritesScreen}
        options={{title: 'Favorites'}}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const NearbyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Nearby"
        component={NearbyScreen}
        options={{title: 'Nearby'}}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
          })}>
          <Tab.Screen
            name="ContactsTab"
            component={ContactsStack}
            options={{
              title: 'Contacts',
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <Icon name="address-book" size={size} color={color} solid />
              ),
            }}
          />
          <Tab.Screen
            name="FavoritesTab"
            component={FavoritesStack}
            options={{
              title: 'Favorites',
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <Icon name="star" size={size} color={color} solid />
              ),
            }}
          />
          <Tab.Screen
            name="NearbyTab"
            component={NearbyStack}
            options={{
              title: 'Nearby',
              headerShown: false,
              tabBarIcon: ({color, size}) => (
                <Icon name="location-dot" size={size} color={color} solid />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
};

export default App;

