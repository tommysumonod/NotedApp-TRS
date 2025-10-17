import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { useAuthContext } from "./AuthContext";

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt?: number | any;
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

  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const notesRef = collection(db, "notes");
    const q = query(notesRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Note[] = snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          // handle Firestore Timestamp or plain JS date/number
          const createdAt = data.createdAt?.toMillis?.()
            ? data.createdAt.toMillis()
            : data.createdAt || Date.now();
          return {
            id: doc.id,
            title: data.title,
            content: data.content,
            createdAt,
          };
        });

        // client sort by createdAt desc
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        setNotes(list);
        setLoading(false);
      },
      (err) => {
        console.error("notes onSnapshot error:", err?.code ?? err, err?.message ?? "");
        setNotes([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addNote = async ({ title, content }: Omit<Note, "id">) => {
    if (!user) throw new Error("No user logged in");

    try {
      const docRef = await addDoc(collection(db, "notes"), {
        userId: user.uid,
        title,
        content,
        createdAt: serverTimestamp(),
      });
      console.log("addNote created doc:", docRef.id);
      return docRef.id;
    } catch (err) {
      console.error("addNote error:", err);
      throw err;
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    if (!user) throw new Error("No user logged in");

    try {
      const noteRef = doc(db, "notes", id);
      await updateDoc(noteRef, { title, content });
    } catch (err) {
      console.error("updateNote error:", err);
      throw err;
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) throw new Error("No user logged in");

    try {
      const noteRef = doc(db, "notes", id);
      await deleteDoc(noteRef);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("deleteNote error:", err);
      throw err;
    }
  };

  return <NotesContext.Provider value={{ notes, loading, addNote, updateNote, deleteNote }}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
};
