// contexts/NotesContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
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
  refresh: () => void;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  useEffect(() => {
    // cleanup previous listener
    if (unsubscribe) {
      unsubscribe();
      setUnsubscribe(null);
    }

    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const notesRef = collection(db, "users", user.uid, "notes");
    const q = query(notesRef, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        })) as Note[];
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

  const updateNote = async (id: string, title: string, content: string) => {
    if (!user) throw new Error("No user");
    const d = doc(db, "users", user.uid, "notes", id);
    await updateDoc(d, { title, content });
  };

  const deleteNote = async (id: string) => {
    if (!user) throw new Error("No user");
    const d = doc(db, "users", user.uid, "notes", id);
    await deleteDoc(d);
  };

  const refresh = () => {
    // re-run listener: simply toggling user effect or recreate listener; for now we rely on realtime
  };

  return (
    <NotesContext.Provider value={{ notes, loading, addNote, updateNote, deleteNote, refresh }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
};
