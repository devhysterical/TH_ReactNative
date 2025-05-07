import React, {createContext, useState, useEffect, useContext} from 'react';
import {
  loginUser,
  registerUser as firebaseRegisterUser,
  logoutUser as firebaseLogoutUser,
  sendPasswordReset,
  updateUserPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  getCurrentUser,
} from '../services/auth';
import {
  getUserDocument,
  createUserDocument,
  updateUserDocument as updateFirestoreUserDocument,
} from '../services/firestore';

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authStatus, setAuthStatus] = useState('initializing');
  const [isVolatileAuth, setIsVolatileAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = firebaseOnAuthStateChanged(async firebaseAuthUser => {
      const currentAuthUserFromSDK = getCurrentUser();
      if (isVolatileAuth && firebaseAuthUser) {
        try {
          const userDoc = await getUserDocument(firebaseAuthUser.uid);
          if (userDoc) {
            setUser({...firebaseAuthUser, ...userDoc});
            setIsAdmin(userDoc.role === 'admin');
          } else {
            setUser(firebaseAuthUser);
            setIsAdmin(false);
          }
        } catch (error) {
          console.warn(
            'AuthContext: Không thể lấy userDoc trong lúc isVolatileAuth, đặt thông tin user cơ bản.',
            error,
          );
          setUser(firebaseAuthUser);
          setIsAdmin(false);
        }
        return;
      }

      if (firebaseAuthUser) {
        if (
          currentAuthUserFromSDK &&
          currentAuthUserFromSDK.uid === firebaseAuthUser.uid
        ) {
          try {
            const userDoc = await getUserDocument(firebaseAuthUser.uid);
            if (userDoc) {
              const userData = {...firebaseAuthUser, ...userDoc};
              setUser(userData);
              setIsAdmin(userDoc.role === 'admin');
              setAuthStatus('authenticated');
            } else {
              console.error(
                'AuthContext: Không tìm thấy user document cho user đã xác thực:',
                firebaseAuthUser.uid,
              );
              setUser(firebaseAuthUser);
              setIsAdmin(false);
              setAuthStatus('unauthenticated');
            }
          } catch (error) {
            console.error('AuthContext: Lỗi khi lấy user document:', error);
            setUser(firebaseAuthUser);
            setIsAdmin(false);
            setAuthStatus('unauthenticated');
          }
        } else if (!currentAuthUserFromSDK) {
          setUser(null);
          setIsAdmin(false);
          setAuthStatus('unauthenticated');
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setAuthStatus('unauthenticated');
      }
    });
    return unsubscribe;
  }, [isVolatileAuth]);

  const login = async (email, password) => {
    setIsVolatileAuth(false);
    setAuthStatus('processing');
    try {
      await loginUser(email, password);
    } catch (e) {
      setAuthStatus('unauthenticated');
      throw e;
    }
  };

  const register = async (email, password, additionalData) => {
    setAuthStatus('processing');
    setIsVolatileAuth(true);
    try {
      const {user: registeredAuthUser} = await firebaseRegisterUser(
        email,
        password,
      );
      await createUserDocument(registeredAuthUser.uid, {
        email,
        ...additionalData,
        role: 'customer',
        createdAt: new Date(),
      });
    } catch (e) {
      setAuthStatus('unauthenticated');
      setIsVolatileAuth(false);
      throw e;
    }
  };

  const logout = async () => {
    setAuthStatus('processing');
    try {
      await firebaseLogoutUser();
    } catch (e) {
      console.error('AuthContext: Lỗi logout:', e);
      setUser(null);
      setIsAdmin(false);
      setAuthStatus('unauthenticated');
      throw e;
    } finally {
      setIsVolatileAuth(false);
    }
  };

  const forgotPassword = async email => {
    setIsVolatileAuth(false);
    try {
      await sendPasswordReset(email);
    } catch (e) {
      throw e;
    }
  };

  const updateProfile = async dataToUpdate => {
    const currentAuthUser = getCurrentUser();
    if (!currentAuthUser) {
      throw new Error(
        'Không có người dùng nào được đăng nhập để cập nhật hồ sơ.',
      );
    }
    setIsVolatileAuth(false);
    setAuthStatus('processing');
    try {
      await updateFirestoreUserDocument(currentAuthUser.uid, dataToUpdate);
      const userDoc = await getUserDocument(currentAuthUser.uid);
      if (userDoc) {
        const updatedUserData = {...currentAuthUser, ...userDoc};
        setUser(updatedUserData);
        setIsAdmin(userDoc.role === 'admin');
      }
      setAuthStatus('authenticated');
    } catch (e) {
      setAuthStatus('authenticated');
      throw e;
    }
  };

  const changePassword = async newPassword => {
    setIsVolatileAuth(false);
    setAuthStatus('processing');
    try {
      await updateUserPassword(newPassword);
      setAuthStatus('authenticated');
    } catch (e) {
      setAuthStatus('authenticated');
      throw e;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: authStatus === 'authenticated',
        isAdmin,
        authStatus,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
        changePassword,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
