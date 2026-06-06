import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';

// Get single user profile by UID
export const getUser = async (uid) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Update user profile
export const updateUser = async (uid, data) => {
  await updateDoc(doc(db, 'users', uid), data);
};

// Get all users (for directory)
export const getAllUsers = async () => {
  const q = query(collection(db, 'users'), where('typeOfUser', '==', 'alumni'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Search users by name
export const searchUsers = async (searchTerm) => {
  const q = query(collection(db, 'users'), where('fullName', '>=', searchTerm), where('fullName', '<=', searchTerm + '\uf8ff'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const sendAlumniRequest = async ({ studentUid, studentName, studentEmail, alumniUid, alumniName, message }) => {
  const requestData = {
    studentUid,
    studentName,
    studentEmail,
    alumniUid,
    alumniName,
    message,
    status: 'pending',
    createdAt: serverTimestamp(),
  };
  await addDoc(collection(db, 'requests'), requestData);
  return requestData;
};

export const getRequestsForAlumni = async (alumniUid) => {
  const q = query(collection(db, 'requests'), where('alumniUid', '==', alumniUid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateRequestStatus = async (requestId, status) => {
  await updateDoc(doc(db, 'requests', requestId), { status, respondedAt: serverTimestamp() });
};
