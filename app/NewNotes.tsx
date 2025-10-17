import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useNotes } from "../contexts/NotesContext";

export default function NewNotes() {
  const { addNote } = useNotes();
  const router = useRouter();

  useEffect(() => {
    const create = async () => {
      try {
        // Create an empty note in Firestore and get its id
        const id = await addNote({ title: "", content: "" });
        // navigate to editor for that note
        router.replace({ pathname: "/screen/NoteViewEditor", params: { id: String(id) } });
      } catch (err) {
        console.error("failed to create note", err);
        // fallback: go back to notes list
        router.replace("/(tabs)/NoteList");
      }
    };

    create();
  }, []);

  return null;
}
