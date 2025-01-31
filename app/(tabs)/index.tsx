import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import DrugItem from "@/components/DrugItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useDrugs } from "@/hooks/useDrugs";
import { Link } from "expo-router";

export default function HomeScreen() {
  const { drugs, loading } = useDrugs();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDrugs = drugs
    .filter((drug) => !drug.isCompleted)
    .filter((drug) =>
      drug.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        paddingTop: Platform.OS === "ios" ? 44 : 55,
      }}
    >
      <ThemedView style={styles.appBar}>
        <ThemedText type="title" style={styles.appBarTitle}>
          Medicamentos
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.searchContainer}>
        <AntDesign name="search1" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar medicamento..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
        <TouchableOpacity onPress={() => setSearchQuery("")}>
          <AntDesign name="close" size={20} color="#666" />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : filteredDrugs.length === 0 ? (
          <ThemedText style={styles.emptyText}>
            {searchQuery
              ? "No se encontraron medicamentos"
              : "No hay medicamentos agregados"}
          </ThemedText>
        ) : (
          filteredDrugs.map((drug) => <DrugItem key={drug.id} drug={drug} />)
        )}
        <View style={{ height: 50 }} />
      </ScrollView>

      <Link href="/addMedicine" asChild>
        <TouchableOpacity style={styles.fab}>
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2196F3",
  },
  appBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#2196F3",
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: Platform.OS === "ios" ? 90 : 20,
    backgroundColor: "#2196F3",
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
