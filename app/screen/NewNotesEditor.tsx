// app/screen/NewNotesEditor.tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useNotes } from "../../contexts/NotesContext";

export default function NewNotesEditor() {
  const { addNote } = useNotes();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert("Error", "Please enter a title or content.");
      return;
    }
    try {
      const id = await addNote({ title, content });
      // navigate to editor for the newly created note
      router.replace({
        pathname: "/screen/NoteViewEditor",
        params: { id },
      });
    } catch (err) {
      console.error("add note error", err);
      Alert.alert("Error", "Could not save note.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.titleInput} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.contentInput} placeholder="Content" value={content} onChangeText={setContent} multiline textAlignVertical="top" />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" }, titleInput: { fontSize: 20, fontWeight: "bold", borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 15, padding: 10 }, contentInput: { flex: 1, fontSize: 16, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 15, marginBottom: 20, backgroundColor: "white" }, button: { backgroundColor: "#3b82f6", padding: 15, borderRadius: 10, alignItems: "center" }, buttonText: { color: "white", fontWeight: "bold", fontSize: 16 }});
