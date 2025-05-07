import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// --- User Management ---
export const getUserDocument = async uid => {
  try {
    const userDoc = await firestore().collection('users').doc(uid).get();
    if (userDoc.exists) {
      return {id: userDoc.id, ...userDoc.data()};
    }
    return null;
  } catch (error) {
    console.error('Firestore Service: Get User Document Error ', error);
    throw error;
  }
};

export const createUserDocument = async (uid, userData) => {
  try {
    await firestore()
      .collection('users')
      .doc(uid)
      .set({
        ...userData,
        uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error('Firestore Service: Create User Document Error ', error);
    throw error;
  }
};

export const updateUserDocument = async (uid, dataToUpdate) => {
  try {
    await firestore()
      .collection('users')
      .doc(uid)
      .update({
        ...dataToUpdate,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error('Firestore Service: Update User Document Error ', error);
    throw error;
  }
};

export const getUsersByRole = async role => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .where('role', '==', role)
      .get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  } catch (error) {
    console.error(
      `Firestore Service: Get Users by Role (${role}) Error `,
      error,
    );
    throw error;
  }
};

// --- Service Management (Admin & Customer) ---
export const addService = async serviceData => {
  try {
    const docRef = await firestore()
      .collection('services')
      .add({
        ...serviceData,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    return docRef.id;
  } catch (error) {
    console.error('Firestore Service: Add Service Error ', error);
    throw error;
  }
};

export const getServices = async () => {
  try {
    const snapshot = await firestore()
      .collection('services')
      .orderBy('name', 'asc')
      .get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  } catch (error) {
    console.error('Firestore Service: Get Services Error ', error);
    throw error;
  }
};

export const getServiceById = async serviceId => {
  try {
    const doc = await firestore().collection('services').doc(serviceId).get();
    if (doc.exists) {
      return {id: doc.id, ...doc.data()};
    }
    console.warn(`Service with ID ${serviceId} not found.`);
    return null;
  } catch (error) {
    console.error('Firestore Service: Get Service By ID Error ', error);
    throw error;
  }
};

export const updateService = async (serviceId, dataToUpdate) => {
  try {
    await firestore()
      .collection('services')
      .doc(serviceId)
      .update({
        ...dataToUpdate,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error('Firestore Service: Update Service Error ', error);
    throw error;
  }
};

export const deleteService = async serviceId => {
  try {
    await firestore().collection('services').doc(serviceId).delete();
  } catch (error) {
    console.error('Firestore Service: Delete Service Error ', error);
    throw error;
  }
};

// --- Appointment Management (Customer & Admin) ---
export const addAppointment = async appointmentData => {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    throw new Error('User not authenticated to add appointment.');
  }
  try {
    const docRef = await firestore()
      .collection('appointments')
      .add({
        ...appointmentData,
        userId: currentUser.uid,
        status: 'Pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    return docRef.id;
  } catch (error) {
    console.error('Firestore Service: Add Appointment Error ', error);
    throw error;
  }
};

export const getAppointmentsByUserId = async userId => {
  try {
    const snapshot = await firestore()
      .collection('appointments')
      .where('userId', '==', userId)
      .orderBy('appointmentDate', 'desc')
      .get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  } catch (error) {
    console.error(
      'Firestore Service: Get Appointments by User ID Error ',
      error,
    );
    throw error;
  }
};

export const getAppointmentById = async appointmentId => {
  try {
    const doc = await firestore()
      .collection('appointments')
      .doc(appointmentId)
      .get();
    if (doc.exists) {
      return {id: doc.id, ...doc.data()};
    }
    return null;
  } catch (error) {
    console.error('Firestore Service: Get Appointment By ID Error ', error);
    throw error;
  }
};

export const getAllAppointments = async () => {
  try {
    const snapshot = await firestore()
      .collection('appointments')
      .orderBy('createdAt', 'desc')
      .get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  } catch (error) {
    console.error('Firestore Service: Get All Appointments Error ', error);
    throw error;
  }
};

export const updateAppointment = async (appointmentId, dataToUpdate) => {
  try {
    await firestore()
      .collection('appointments')
      .doc(appointmentId)
      .update({
        ...dataToUpdate,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error('Firestore Service: Update Appointment Error ', error);
    throw error;
  }
};

export const deleteAppointment = async appointmentId => {
  try {
    await firestore().collection('appointments').doc(appointmentId).delete();
  } catch (error) {
    console.error('Firestore Service: Delete Appointment Error ', error);
    throw error;
  }
};
