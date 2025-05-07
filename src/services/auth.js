import auth from '@react-native-firebase/auth';

export const loginUser = async (email, password) => {
  try {
    return await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Auth Service: Login Error ', error);
    throw error;
  }
};

export const registerUser = async (email, password) => {
  try {
    return await auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Auth Service: Registration Error ', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    return await auth().signOut();
  } catch (error) {
    console.error('Auth Service: Logout Error ', error);
    throw error;
  }
};

export const sendPasswordReset = async email => {
  try {
    return await auth().sendPasswordResetEmail(email);
  } catch (error) {
    console.error('Auth Service: Password Reset Error ', error);
    throw error;
  }
};

export const updateUserPassword = async newPassword => {
  try {
    const currentUser = auth().currentUser;
    if (currentUser) {
      return await currentUser.updatePassword(newPassword);
    }
    throw new Error('No user is currently signed in to update password.');
  } catch (error) {
    console.error('Auth Service: Update Password Error ', error);
    throw error;
  }
};

export const onAuthStateChanged = callback => {
  return auth().onAuthStateChanged(callback);
};

export const getCurrentUser = () => {
  return auth().currentUser;
};
