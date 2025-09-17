import { db } from "./firebaseConfig"; // your firebase config file
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const NOTES_COLLECTION = "notes";

// Add a new note
export const addNote = async (userId: string, title: string, content: string) => {
  return await addDoc(collection(db, NOTES_COLLECTION), {
    userId,
    title,
    content,
    createdAt: new Date(),
  });
};

// Update an existing note
export const updateNote = async (id: string, title: string, content: string) => {
  const noteRef = doc(db, NOTES_COLLECTION, id);
  await updateDoc(noteRef, { title, content, updatedAt: new Date() });
};

// Delete a note
export const deleteNote = async (id: string) => {
  const noteRef = doc(db, NOTES_COLLECTION, id);
  await deleteDoc(noteRef);
};

// Get all notes by user
export const getNotesByUser = async (userId: string) => {
  const q = query(collection(db, NOTES_COLLECTION), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
