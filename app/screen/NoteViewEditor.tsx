// app/screen/NoteViewEditor.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNotes } from "../../contexts/NotesContext";

export default function NoteViewEditor() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { notes, updateNote, deleteNote, loading } = useNotes();

  const note = notes.find((n) => n.id === id);
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");

  useEffect(() => {
    if (note) {
      setTitle(note.title ?? "");
      setContent(note.content ?? "");
    }
  }, [note]);

  const handleSave = async () => {
    if (!id) return;
    if (!title.trim() && !content.trim()) {
      Alert.alert("Error", "Please enter a title or content.");
      return;
    }
    try {
      await updateNote(String(id), title, content);
      router.back();
    } catch (err) {
      console.error("update error", err);
      Alert.alert("Error", "Could not save note.");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteNote(String(id));
      router.back();
    } catch (err) {
      console.error("delete error", err);
      Alert.alert("Error", "Could not delete note.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      <TextInput
        style={styles.contentInput}
        value={content}
        onChangeText={setContent}
        placeholder="Content"
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" },
  titleInput: {
    fontSize: 20,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
  },
  contentInput: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  deleteButton: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#dc2626",
  },
  deleteText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
