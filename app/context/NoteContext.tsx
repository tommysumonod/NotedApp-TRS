// app/context/NotesContext.tsx
import React, { createContext, useContext, useState } from "react";

type Note = {
  id: string;
  title: string;
  content: string;
};

type NotesContextType = {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
};

const NotesContext = createContext<NotesContextType | null>(null);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([
    { id: "1", title: "Sample Note", content: "This is a sample note." },
  ]);

  const addNote = (note: Note) => setNotes((prev) => [...prev, note]);

  const updateNote = (id: string, title: string, content: string) =>
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, title, content } : note
      )
    );

  const deleteNote = (id: string) =>
    setNotes((prev) => prev.filter((note) => note.id !== id));

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error("useNotes must be used within NotesProvider");
  return context;
};
