// app/screen/NewNotesEditor.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButtonCircle} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>
      <TextInput style={styles.titleInput} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.contentInput} placeholder="Content" value={content} onChangeText={setContent} multiline textAlignVertical="top" />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Note</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" }, backButtonContainer: { alignSelf: "flex-start", marginBottom: 8 }, backButtonCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: "#3b82f6", alignItems: "center", justifyContent: "center", backgroundColor: "white" }, titleInput: { fontSize: 20, fontWeight: "bold", borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 15, padding: 10 }, contentInput: { flex: 1, fontSize: 16, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 15, marginBottom: 20, backgroundColor: "white" }, button: { backgroundColor: "#3b82f6", padding: 15, borderRadius: 10, alignItems: "center" }, buttonText: { color: "white", fontWeight: "bold", fontSize: 16 }});
