// contexts/NotesContext.tsx
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { useAuthContext } from "./AuthContext";

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt?: any;
};

type NotesContextType = {
  notes: Note[];
  loading: boolean;
  addNote: (note: Omit<Note, "id">) => Promise<string>;
  updateNote: (id: string, title: string, content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (unsubscribe) {
      unsubscribe();
      setUnsubscribe(null);
    }

    if (!user) {
      // no user = no notes
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // ✅ listen to this user's notes only
    const notesRef = collection(db, "users", user.uid, "notes");
    const q = query(notesRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map(
          (d) =>
            ({
              id: d.id,
              ...(d.data() as any),
            } as Note)
        );
        setNotes(list);
        setLoading(false);
      },
      (err) => {
        console.error("notes onSnapshot error:", err);
        setLoading(false);
      }
    );

    setUnsubscribe(() => unsub);

    return () => unsub();
  }, [user]);

  // ✅ add new note under /users/{uid}/notes
  const addNote = async ({ title, content }: Omit<Note, "id">) => {
    if (!user) throw new Error("No user");
    const notesRef = collection(db, "users", user.uid, "notes");
    const docRef = await addDoc(notesRef, {
      title,
      content,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  };

  // ✅ update a note under /users/{uid}/notes/{id}
  const updateNote = async (id: string, title: string, content: string) => {
    if (!user) throw new Error("No user");
    const d = doc(db, "users", user.uid, "notes", id);
    await updateDoc(d, { title, content });
  };

  // ✅ delete a note under /users/{uid}/notes/{id}
  const deleteNote = async (id: string) => {
    if (!user) throw new Error("No user");
    const noteRef = doc(db, "users", user.uid, "notes", id);
    await deleteDoc(noteRef);
  };

  return (
    <NotesContext.Provider value={{ notes, loading, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
};
