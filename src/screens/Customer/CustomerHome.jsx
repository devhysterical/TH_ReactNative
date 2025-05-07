import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useAuth} from '../../context/AuthContext';

const CustomerHomeScreen = () => {
  const {logout, user} = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Home</Text>
      <Text>Xin chào, {user?.email}!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default CustomerHomeScreen;
