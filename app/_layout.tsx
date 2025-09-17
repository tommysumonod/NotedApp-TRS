import { Stack } from "expo-router";
import { NotesProvider } from "./context/NoteContext";

export default function RootLayout() {
  return (
    <NotesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth */}
        <Stack.Screen name="index" />
        <Stack.Screen name="screen/login" />
        <Stack.Screen name="screen/register" />

        {/* Tabs group */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Notes-related */}
        <Stack.Screen name="screen/NoteViewEditor" />
        <Stack.Screen name="screen/NewNotesEditor" />  {/* ✅ added */}
      </Stack>
    </NotesProvider>
  );
}
