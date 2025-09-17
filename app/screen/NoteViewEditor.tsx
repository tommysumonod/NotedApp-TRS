// app/screen/NoteViewEditor.tsx
import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useNotes } from "../../contexts/NotesContext";

export default function NoteViewEditor() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { notes, updateNote, deleteNote } = useNotes();

  const note = notes.find((n) => n.id === id);
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");

  useEffect(() => {
    if (note) {
      setTitle(note.title ?? "");
      setContent(note.content ?? "");
    }
  }, [note?.id]);

  const handleSave = async () => {
    if (!id) return;
    try {
      await updateNote(String(id), title, content);
      router.back();
    } catch (err) {
      console.error("update error", err);
      Alert.alert("Error", "Could not save note.");
    }
  };

  const handleDelete = async () => {
    Alert.alert("Delete Note", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            if (id) await deleteNote(String(id));
            router.replace("/(tabs)/NoteList");
          } catch (err) {
            console.error("delete error", err);
            Alert.alert("Error", "Could not delete note.");
          }
        },
      },
    ]);
  };

  if (!note) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Note not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.titleInput} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.contentInput} placeholder="Content" value={content} onChangeText={setContent} multiline textAlignVertical="top" />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" }, titleInput: { fontSize: 20, fontWeight: "bold", borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 15, padding: 10 }, contentInput: { flex: 1, fontSize: 16, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 15, marginBottom: 20, backgroundColor: "white" }, button: { backgroundColor: "#3b82f6", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 12 }, buttonText: { color: "white", fontWeight: "bold", fontSize: 16 }, deleteButton: { alignItems: "center", padding: 12 }, deleteText: { color: "#ef4444", fontWeight: "bold" }});
