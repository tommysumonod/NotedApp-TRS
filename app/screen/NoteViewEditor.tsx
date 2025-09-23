// app/screen/NoteViewEditor.tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  }, [note]);

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
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Note not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButtonCircle} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>
      <TextInput style={styles.titleInput} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.contentInput} placeholder="Content" value={content} onChangeText={setContent} multiline textAlignVertical="top" />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete Note</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" }, backButtonContainer: { alignSelf: "flex-start", marginBottom: 8 }, backButtonCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: "#3b82f6", alignItems: "center", justifyContent: "center", backgroundColor: "white" }, titleInput: { fontSize: 20, fontWeight: "bold", borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 15, padding: 10 }, contentInput: { flex: 1, fontSize: 16, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 15, marginBottom: 20, backgroundColor: "white" }, button: { backgroundColor: "#3b82f6", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 12 }, buttonText: { color: "white", fontWeight: "bold", fontSize: 16 }, deleteButton: { alignItems: "center", padding: 12 }, deleteText: { color: "#ef4444", fontWeight: "bold" }});
