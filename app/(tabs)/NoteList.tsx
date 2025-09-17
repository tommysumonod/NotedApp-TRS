// app/(tabs)/NoteList.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useNotes } from "../../contexts/NotesContext";

export default function NoteList() {
  const { notes, loading } = useNotes();
  const router = useRouter();

  if (loading) return <View style={{flex:1,justifyContent:"center"}}><ActivityIndicator /></View>;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/screen/NewNotesEditor")}>
        <Text style={styles.addText}>+ Add Note</Text>
      </TouchableOpacity>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteBox}
            onPress={() =>
              router.push({
                pathname: "/screen/NoteViewEditor",
                params: { id: item.id },
              })
            }
          >
            <Text style={styles.title}>{item.title || "Untitled"}</Text>
            <Text style={styles.content} numberOfLines={1}>
              {item.content}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 }, addButton: { backgroundColor: "#3b82f6", padding: 12, borderRadius: 10, marginBottom: 15, alignItems: "center" }, addText: { color: "white", fontWeight: "bold", fontSize: 16 }, noteBox: { padding: 15, backgroundColor: "#fff", borderRadius: 10, marginBottom: 10, elevation: 2 }, title: { fontSize: 18, fontWeight: "bold" }, content: { fontSize: 14, color: "#555" }});
