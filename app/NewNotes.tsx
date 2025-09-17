import { useRouter } from "expo-router";
import { useNotes } from "./context/NoteContext";
import { v4 as uuidv4 } from "uuid";

export default function NewNotes() {
  const { addNote } = useNotes();
  const router = useRouter();

  const handleCreate = () => {
    // create a blank note
    const newId = uuidv4();
    addNote({ id: newId, title: "", content: "" });

    // redirect directly to editor for that note
    router.replace({
      pathname: "./screen/NoteViewEditor",
      params: { id: newId },
    });
  };

  // run immediately
  handleCreate();

  return null; // no UI, it just redirects
}
