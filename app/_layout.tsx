// app/_layout.tsx
import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { NotesProvider } from "../contexts/NotesContext";
import React from "react";

export default function RootLayout() {
  return (
    <AuthProvider>
      <NotesProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="screen/login" />
          <Stack.Screen name="screen/register" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="screen/NoteViewEditor" />
          <Stack.Screen name="screen/NewNotesEditor" />
        </Stack>
      </NotesProvider>
    </AuthProvider>
  );
}
