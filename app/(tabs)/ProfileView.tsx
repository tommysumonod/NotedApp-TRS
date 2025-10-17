import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNotes } from "../../contexts/NotesContext";

export default function ProfileView() {
  const { user, signOut } = useAuthContext();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.replace("/screen/login");
  };

  const { notes } = useNotes();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>UID</Text>
        <Text style={styles.value}>{user?.uid}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Notes count</Text>
        <Text style={styles.value}>{notes?.length ?? 0}</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  infoBox: { marginBottom: 15 },
  label: { fontSize: 14, color: "gray" },
  value: { fontSize: 18, fontWeight: "500" },
  logoutBtn: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 10,
    marginTop: 40,
    alignItems: "center",
  },
  logoutText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
