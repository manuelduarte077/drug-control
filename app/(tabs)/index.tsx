import { AntDesign } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import DrugItem from "@/components/DrugItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useDrugs } from "@/hooks/useDrugs";
import { useFocusEffect } from '@react-navigation/native';
import { Link } from "expo-router";
import { useCallback } from 'react';

export default function HomeScreen() {
  const { drugs, loading, refresh } = useDrugs();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        paddingTop: Platform.OS === "ios" ? 44 : 55,
      }}>
      <ThemedView style={styles.appBar}>
        <ThemedText type="title" style={styles.appBarTitle}>
          Medicamentos
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : drugs.length === 0 ? (
          <ThemedText style={styles.emptyText}>
            No hay medicamentos agregados
          </ThemedText>
        ) : (
          drugs.map((drug) => (
            <DrugItem key={drug.id} drug={drug} />
          ))
        )}
      </ThemedView>

      <Link href="/addMedicine" asChild>
        <TouchableOpacity style={styles.fab}>
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
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
  content: {
    flex: 1,
    gap: 16,
    padding: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
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
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
